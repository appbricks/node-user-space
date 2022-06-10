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
  SpaceTelemetrySubscriptionPayload,
  SpaceUserPayload,
  SUBSCRIBE_TO_SPACE_TELEMETRY,
  SPACE_TELEMETRY
} from '../actions';
import {
  SUBSCRIPTION_FATAL_ERROR
} from '../constants';

export const subscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpicSubscription<SpaceTelemetrySubscriptionPayload, SpaceUserPayload>(
    SUBSCRIBE_TO_SPACE_TELEMETRY, 
    async (action, state$, update, error) => {

      action.payload!.unsubscribeSpaceUsers.forEach(({ spaceID, userID }) => {
        csProvider.unsubscribeFromSpaceUserUpdates(spaceID, userID!);
      })
      action.payload!.subscribeSpaceUsers.forEach(({ spaceID, userID }) => {
        csProvider.subscribeToSpaceUserUpdates(
          spaceID, userID,
          data => {
            const spaceUser = data.spaceUser!;
            spaceUser.space = { __typename: 'Space', spaceID: data.spaceID };
            spaceUser.user = { __typename: 'User', userID: data.userID };
            update(createAction<SpaceUserPayload>(SPACE_TELEMETRY, { spaceUser }))
          },
          err => {
            error(createErrorAction(err))
          }
        );  
      })
      return createFollowUpAction(action, SUCCESS);
    },
    SUBSCRIPTION_FATAL_ERROR
  );
}
