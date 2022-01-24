import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  SUCCESS,
  Action, 
  createAction, 
  createFollowUpAction, 
  serviceEpic,
  serviceEpicSubscription, 
  createErrorAction
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  UserIDPayload,
  UserPayload,
  SUBSCRIBE_TO_USER_UPDATES,
  UNSUBSCRIBE_FROM_USER_UPDATES,
  USER_UPDATE,
  GET_USER_DEVICES,
  GET_USER_SPACES
} from '../actions';
import {
  UserSpaceStateProps
} from '../state';

export const subscribeAction = 
  (dispatch: redux.Dispatch<redux.Action>, userID: string) => 
    dispatch(createAction(SUBSCRIBE_TO_USER_UPDATES, <UserIDPayload>{ userID }));

export const unsubscribeAction = 
  (dispatch: redux.Dispatch<redux.Action>, userID: string) => 
    dispatch(createAction(UNSUBSCRIBE_FROM_USER_UPDATES, <UserIDPayload>{ userID }));

export const subscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpicSubscription<UserIDPayload, UserPayload, UserSpaceStateProps>(
    SUBSCRIBE_TO_USER_UPDATES, 
    async (action, state$, update, error) => {
      csProvider.subscribeToUserUpdates(
        action.payload!.userID, 
        data => {
          if (data.numDevices && state$.value.userspace!.userDevices.length != data.numDevices) {
            update(createAction(GET_USER_DEVICES));
          }
          if (data.numSpaces && state$.value.userspace!.userSpaces.length != data.numSpaces) {
            update(createAction(GET_USER_SPACES));
          }
          update(createAction<UserPayload>(USER_UPDATE, { user: data.user! }))
        },
        err => {
          error(createErrorAction(err))
        }
      );
      return createFollowUpAction(action, SUCCESS);
    }
  );
}

export const unsubscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpic<UserIDPayload>(
    UNSUBSCRIBE_FROM_USER_UPDATES, 
    async (action, state$) => {
      await csProvider.unsubscribeFromUserUpdates(action.payload!.userID);
      return createFollowUpAction(action, SUCCESS);
    }
  );
}
