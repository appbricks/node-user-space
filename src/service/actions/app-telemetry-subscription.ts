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
  AppTelemetrySubscriptionPayload,
  AppUserPayload,
  SUBSCRIBE_TO_APP_TELEMETRY,
  APP_TELEMETRY
} from '../actions';
import {
  SUBSCRIPTION_FATAL_ERROR
} from '../constants';

export const subscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpicSubscription<AppTelemetrySubscriptionPayload, AppUserPayload>(
    SUBSCRIBE_TO_APP_TELEMETRY, 
    async (action, state$, update, error) => {

      action.payload!.unsubscribeAppUsers.forEach(({ appID, userID }) => {
        csProvider.unsubscribeFromAppUserUpdates(appID, userID!);
      })
      action.payload!.subscribeAppUsers.forEach(({ appID, userID }) => {
        csProvider.subscribeToAppUserUpdates(
          appID, userID,
          data => {
            const appUser = data.appUser!;
            appUser.app = { __typename: 'App', appID: data.appID };
            appUser.user = { __typename: 'User', userID: data.userID };
            update(createAction<AppUserPayload>(APP_TELEMETRY, { appUser }))
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
