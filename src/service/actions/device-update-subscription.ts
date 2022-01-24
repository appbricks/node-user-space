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
  DeviceUpdateSubscriptionPayload,
  DevicePayload,
  SUBSCRIBE_TO_DEVICE_UPDATES,
  GET_USER_DEVICES,
  DEVICE_UPDATE
} from '../actions';
import {
  UserSpaceStateProps
} from '../state';

export const subscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpicSubscription<DeviceUpdateSubscriptionPayload, DevicePayload, UserSpaceStateProps>(
    SUBSCRIBE_TO_DEVICE_UPDATES,
    async (action, state$, update, error) => {

      action.payload!.unsubscribeDevices.forEach(deviceID =>
        csProvider.unsubscribeFromDeviceUpdates(deviceID)
      );
      action.payload!.subscribeDevices.forEach(deviceID =>
        csProvider.subscribeToDeviceUpdates(
          deviceID,
          data => {
            const numDeviceUsers = state$.value.userspace?.userDevices
              .find(du => du.device?.deviceID == deviceID)?.device?.users?.deviceUsers?.length
            if (numDeviceUsers && numDeviceUsers != data.numUsers) {
              update(createAction(GET_USER_DEVICES));
            } else {
              const device = data.device!;
              device.deviceID = data.deviceID;
              update(createAction<DevicePayload>(DEVICE_UPDATE, { device }))
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
