import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  NOOP,
  BROADCAST,
  BroadCastPayload,
  createAction, 
  serviceEpicSubscription, 
  createErrorAction,
  ErrorPayload
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  GET_USER_DEVICES,
  GET_USER_SPACES
} from '../actions';
import {
  UserSpaceStateProps
} from '../state';
import {
  ERROR_UPDATE_USER
} from '../constants';

export const subscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpicSubscription<BroadCastPayload, BroadCastPayload | ErrorPayload, UserSpaceStateProps>(
    BROADCAST, 
    async (action, state$, update, error) => {
      // if a user login broadcast payload is
      // seen then create a subscription for
      // the logged in user
      if (action.payload?.__typename == 'UserLogin') {

        csProvider.subscribeToUserUpdates(
          action.payload!.userID, 
          data => {
            if (data) {
              if (data.numDevices 
                && state$.value.userspace!.deviceUpdatesActive 
                && state$.value.userspace!.userDevices.length != data.numDevices) {
                update(createAction(GET_USER_DEVICES));
              }
              if (data.numSpaces 
                && state$.value.userspace!.spaceUpdatesActive 
                && state$.value.userspace!.userSpaces.length != data.numSpaces) {
                update(createAction(GET_USER_SPACES));
              }
              update(createAction<BroadCastPayload>(BROADCAST, { ...data.user! }))  
            } else {
              update(createErrorAction(new Error(ERROR_UPDATE_USER)))
            }
          },
          err => {
            error(createErrorAction(err))
          }
        );
      }
      return createAction(NOOP);
    }
  );
}
