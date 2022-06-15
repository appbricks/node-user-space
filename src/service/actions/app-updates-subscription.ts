import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  SUCCESS,
  createAction,
  createFollowUpAction, 
  serviceEpicSubscription, 
  serviceEpic,
  createErrorAction
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  AppUpdateSubscriptionPayload,
  AppPayload,
  SUBSCRIBE_TO_APP_UPDATES,
  UNSUBSCRIBE_FROM_APP_UPDATES,
  GET_USER_APPS,
  APP_UPDATE
} from '../actions';
import { 
  UserSpaceStateProps 
} from '../state';
import {
  SUBSCRIPTION_FATAL_ERROR
} from '../constants';

export const unsubscribeAction = 
  (dispatch: redux.Dispatch<redux.Action>) => 
    dispatch(createAction(UNSUBSCRIBE_FROM_APP_UPDATES));

export const subscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpicSubscription<AppUpdateSubscriptionPayload, AppPayload, UserSpaceStateProps>(
    SUBSCRIBE_TO_APP_UPDATES, 
    async (action, state$, update, error) => {

      action.payload!.unsubscribeApps.forEach(appID =>
        csProvider.unsubscribeFromAppUpdates(appID)
      );
      action.payload!.subscribeApps.forEach(appID =>
        csProvider.subscribeToAppUpdates(
          appID,
          data => {
            const numAppUsers = state$.value.userspace?.userApps
              .find(au => au.app?.appID == appID)?.app?.users?.appUsers?.length
            if (data.numUsers && data.numUsers != numAppUsers) {
              update(createAction(GET_USER_APPS));
            } else {
              const app = data.app!;
              app.appID = data.appID;
              update(createAction<AppPayload>(APP_UPDATE, { app }))
            }
          },
          err => {
            error(createErrorAction(err))
          }
        )
      );
      return createFollowUpAction(action, SUCCESS);
    },
    SUBSCRIPTION_FATAL_ERROR
  );
}

export const unsubscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpic<void, UserSpaceStateProps>(
    UNSUBSCRIBE_FROM_APP_UPDATES, 
    async (action, state$) => {
      let waitList: Promise<any>[] = [];

      state$.value.userspace?.userApps.forEach(
        userApp => {
          let app = userApp.app!;
          let appID = app.appID!;

          waitList.push(csProvider.unsubscribeFromAppUpdates(appID))
          app.users?.appUsers?.forEach(au => 
            waitList.push(csProvider.unsubscribeFromAppUserUpdates(appID, au?.user?.userID!))
          );
        }
      );
      await Promise.all(waitList);

      return createFollowUpAction(action, SUCCESS);
    }
  );
}
