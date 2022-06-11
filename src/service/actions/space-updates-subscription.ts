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
  SpaceUpdateSubscriptionPayload,
  SpacePayload,
  SUBSCRIBE_TO_SPACE_UPDATES,
  UNSUBSCRIBE_FROM_SPACE_UPDATES,
  GET_USER_SPACES,
  SPACE_UPDATE
} from '../actions';
import { 
  UserSpaceStateProps 
} from '../state';
import {
  SUBSCRIPTION_FATAL_ERROR
} from '../constants';

export const unsubscribeAction = 
  (dispatch: redux.Dispatch<redux.Action>) => 
    dispatch(createAction(UNSUBSCRIBE_FROM_SPACE_UPDATES));

export const subscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpicSubscription<SpaceUpdateSubscriptionPayload, SpacePayload, UserSpaceStateProps>(
    SUBSCRIBE_TO_SPACE_UPDATES, 
    async (action, state$, update, error) => {

      action.payload!.unsubscribeSpaces.forEach(spaceID =>
        csProvider.unsubscribeFromSpaceUpdates(spaceID)
      );
      action.payload!.subscribeSpaces.forEach(spaceID =>
        csProvider.subscribeToSpaceUpdates(
          spaceID,
          data => {
            const numSpaceUsers = state$.value.userspace?.userSpaces
              .find(du => du.space?.spaceID == spaceID)?.space?.users?.spaceUsers?.length
            if (data.numUsers && data.numUsers != numSpaceUsers) {
              update(createAction(GET_USER_SPACES));
            } else {
              const space = data.space!;
              space.spaceID = data.spaceID;
              update(createAction<SpacePayload>(SPACE_UPDATE, { space }))
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
    UNSUBSCRIBE_FROM_SPACE_UPDATES, 
    async (action, state$) => {
      let waitList: Promise<any>[] = [];

      state$.value.userspace?.userSpaces.forEach(
        userSpace => {
          let space = userSpace.space!;
          let spaceID = space.spaceID!;

          waitList.push(csProvider.unsubscribeFromSpaceUpdates(spaceID))
          space.users?.spaceUsers?.forEach(su => 
            waitList.push(csProvider.unsubscribeFromSpaceUserUpdates(spaceID, su?.user?.userID!))
          );
        }
      );
      await Promise.all(waitList);

      return createFollowUpAction(action, SUCCESS);
    }
  );
}
