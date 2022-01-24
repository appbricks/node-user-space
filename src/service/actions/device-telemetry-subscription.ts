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
  DeviceTelemetrySubscriptionPayload,
  DeviceUserPayload,
  SUBSCRIBE_TO_DEVICE_TELEMETRY,
  DEVICE_TELEMETRY
} from '../actions';

export const subscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpicSubscription<DeviceTelemetrySubscriptionPayload, DeviceUserPayload>(
    SUBSCRIBE_TO_DEVICE_TELEMETRY,
    async (action, state$, update, error) => {

      action.payload!.unsubscribeDeviceUsers.forEach(({ deviceID, userID }) => {
        csProvider.unsubscribeFromDeviceUserUpdates(deviceID, userID!);
      })
      action.payload!.subscribeDeviceUsers.forEach(({ deviceID, userID }) => {
        csProvider.subscribeToDeviceUserUpdates(
          deviceID, userID,
          data => {
            const deviceUser = data.deviceUser!;
            deviceUser.device = { __typename: 'Device', deviceID: data.deviceID };
            deviceUser.user = { __typename: 'User', userID: data.userID };
            update(createAction<DeviceUserPayload>(DEVICE_TELEMETRY, { deviceUser }))
          },
          err => {
            error(createErrorAction(err))
          }
        );
      })
      return createFollowUpAction(action, SUCCESS);
    }
  );
}
