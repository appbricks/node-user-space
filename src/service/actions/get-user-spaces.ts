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
  SpaceUsersPayload,
  SpaceUpdateSubscriptionPayload,
  SpaceTelemetrySubscriptionPayload,
  GET_USER_SPACES,
  SUBSCRIBE_TO_SPACE_UPDATES,
  SUBSCRIBE_TO_SPACE_TELEMETRY,
} from '../actions';
import {
  UserSpaceStateProps
} from '../state';
import {
  SpaceUser
} from '../../model/types';

export const action =
  (dispatch: redux.Dispatch<redux.Action>) =>
    dispatch(createAction(GET_USER_SPACES));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<void, UserSpaceStateProps>(
    GET_USER_SPACES,
    {
      getUserSpaces: async (action, state$) => {
        const spaceUsers = await csProvider.getUserSpaces();
        return createFollowUpAction<SpaceUsersPayload>(action, SUCCESS, { spaceUsers });
      },
      subscribeToSpaceUpdates: async (action, state$, callSync) => {
        let dependsAction: Action;
        try {
          dependsAction = await callSync['getUserSpaces'];
        } catch (error) {
          return createAction(NOOP);
        }

        if (dependsAction.type == SUCCESS) {

          const [ unsubscribeSpaces, subscribeSpaces ] = calculateDiffs(
            state$.value.userspace!.userSpaces.map(su => su.space!.spaceID!),
            (<SpaceUsersPayload>dependsAction.payload).spaceUsers.map(su => su.space!.spaceID!)
          );
          if (unsubscribeSpaces.length > 0 || subscribeSpaces.length > 0) {
            return createAction<SpaceUpdateSubscriptionPayload>(SUBSCRIBE_TO_SPACE_UPDATES, {
              subscribeSpaces, unsubscribeSpaces
            });  
          }
        }
        return createAction(NOOP);
      },
      subscribeToSpaceTelemetry: async (action, state$, callSync) => {
        let dependsAction: Action;
        try {
          dependsAction = await callSync['getUserSpaces'];
        } catch (error) {
          return createAction(NOOP);
        }

        if (dependsAction.type == SUCCESS) {

          const subscriptionList = (spaceUsers: SpaceUser[]) =>
            spaceUsers
              .filter(su => su.isOwner)
              // for owned spaces enumerate the space's users
              .flatMap(
                su1 => su1.space!.users!.spaceUsers!.map(
                  su2 => su1!.space!.spaceID! + '|' + su2!.user!.userID!
                )
              )
              .concat(
                spaceUsers
                  .filter(su => !su.isOwner)
                  .map(su =>su!.space!.spaceID! + '|' + su!.user!.userID!)
              );
              
          const [ unsubscribeSpaceUsers, subscribeSpaceUsers ] = calculateDiffs(
            subscriptionList(state$.value.userspace!.userSpaces),
            subscriptionList((<SpaceUsersPayload>dependsAction.payload).spaceUsers)
          );
          if (unsubscribeSpaceUsers.length > 0 || subscribeSpaceUsers.length > 0) {
            return createAction<SpaceTelemetrySubscriptionPayload>(SUBSCRIBE_TO_SPACE_TELEMETRY, {
              subscribeSpaceUsers: subscribeSpaceUsers.map(
                v => {
                  const s = v.split('|');
                  return { spaceID: s[0], userID: s[1]};
                }
              ),
              unsubscribeSpaceUsers: unsubscribeSpaceUsers.map(
                v => {
                  const s = v.split('|');
                  return { spaceID: s[0], userID: s[1]};
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
