import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  SUCCESS,
  createAction,
  createFollowUpAction, 
  serviceEpicSubscription, 
  createErrorAction
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  SpaceUpdateSubscriptionPayload,
  SpacePayload,
  SUBSCRIBE_TO_SPACE_UPDATES,
  GET_USER_SPACES,
  SPACE_UPDATE
} from '../actions';
import { 
  UserSpaceStateProps 
} from '../state';

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
    }
  );
}
