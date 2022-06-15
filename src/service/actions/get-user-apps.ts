import * as redux from 'redux';
import { Epic } from 'redux-observable';

import {
  SUCCESS,
  NOOP,
  Action,
  createAction,
  createFollowUpAction,
  serviceEpicFanOut,
  calculateDiffs
} from '@appbricks/utils';

import Provider from '../provider';
import {
  AppUsersPayload,
  AppUpdateSubscriptionPayload,
  AppTelemetrySubscriptionPayload,
  GET_USER_APPS,
  SUBSCRIBE_TO_APP_UPDATES,
  SUBSCRIBE_TO_APP_TELEMETRY
} from '../actions';
import {
  UserSpaceStateProps
} from '../state';
import { 
  AppUser 
} from '../../model/types';

export const action =
  (dispatch: redux.Dispatch<redux.Action>) =>
    dispatch(createAction(GET_USER_APPS));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<void, UserSpaceStateProps>(
    GET_USER_APPS,
    {
      getUserApps: async (action, state$, callSync) => {
        const appUsers = await csProvider.getUserApps();
        return createFollowUpAction<AppUsersPayload>(action, SUCCESS, { appUsers });
      },
      subscribeToAppUpdates: async (action, state$, callSync) => {
        let dependsAction: Action;
        try {
          dependsAction = await callSync['getUserApps'];
        } catch (error) {
          return createAction(NOOP);
        }
        
        if (dependsAction.type == SUCCESS) {

          const userApps = state$.value.userspace!.appUpdatesActive
            ? state$.value.userspace!.userApps : [];
          const [ unsubscribeApps, subscribeApps ] = calculateDiffs(
            userApps.map(au => au.app!.appID!),
            (<AppUsersPayload>dependsAction.payload).appUsers.map(au => au.app!.appID!)
          );
          if (unsubscribeApps.length > 0 || subscribeApps.length > 0) {
            return createAction<AppUpdateSubscriptionPayload>(SUBSCRIBE_TO_APP_UPDATES, {
              subscribeApps, unsubscribeApps
            });
          }
        }
        return createAction(NOOP);
      },
      subscribeToAppTelemetry: async (action, state$, callSync) => {
        let dependsAction: Action;
        try {
          dependsAction = await callSync['getUserApps'];
        } catch (error) {
          return createAction(NOOP);
        }

        if (dependsAction.type == SUCCESS) {

          const subscriptionList = (appUsers: AppUser[]) =>
            appUsers
              .filter(au => au.isOwner)
              // for owned apps enumerate the app's users
              .flatMap(
                au1 => au1.app!.users!.appUsers!.map(
                  au2 => au1!.app!.appID! + '|' + au2!.user!.userID!
                )
              )
              .concat(
                appUsers
                  .filter(au => !au.isOwner)
                  .map(au =>au!.app!.appID! + '|' + au!.user!.userID!)
              );

            const userApps = state$.value.userspace!.appUpdatesActive
              ? state$.value.userspace!.userApps : [];
            const [ unsubscribeAppUsers, subscribeAppUsers ] = calculateDiffs(
            subscriptionList(userApps),
            subscriptionList((<AppUsersPayload>dependsAction.payload).appUsers)
          );
          if (unsubscribeAppUsers.length > 0 || subscribeAppUsers.length > 0) {
            return createAction<AppTelemetrySubscriptionPayload>(SUBSCRIBE_TO_APP_TELEMETRY, {
              subscribeAppUsers: subscribeAppUsers.map(
                v => {
                  const s = v.split('|');
                  return { appID: s[0], userID: s[1]};
                }
              ),
              unsubscribeAppUsers: unsubscribeAppUsers.map(
                v => {
                  const s = v.split('|');
                  return { appID: s[0], userID: s[1]};
                }
              )
            });
          }
        }
        return createAction(NOOP);
      }
    }
  );
}
