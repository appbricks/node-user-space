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
  DeviceUpdateSubscriptionPayload,
  DevicePayload,
  SUBSCRIBE_TO_DEVICE_UPDATES,
  UNSUBSCRIBE_FROM_DEVICE_UPDATES,
  GET_USER_DEVICES,
  DEVICE_UPDATE
} from '../actions';
import {
  UserSpaceStateProps
} from '../state';
import {
  SUBSCRIPTION_FATAL_ERROR
} from '../constants';

export const unsubscribeAction = 
  (dispatch: redux.Dispatch<redux.Action>) => 
    dispatch(createAction(UNSUBSCRIBE_FROM_DEVICE_UPDATES));

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
            if (data.numUsers && data.numUsers != numDeviceUsers) {
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
    },
    SUBSCRIPTION_FATAL_ERROR
  );
}

export const unsubscribeEpic = (csProvider: Provider): Epic => {

  return serviceEpic<void, UserSpaceStateProps>(
    UNSUBSCRIBE_FROM_DEVICE_UPDATES, 
    async (action, state$) => {
      let waitList: Promise<any>[] = [];

      state$.value.userspace?.userDevices.forEach(
        userDevice => {
          let device = userDevice.device!;
          let deviceID = device.deviceID!;

          waitList.push(csProvider.unsubscribeFromDeviceUpdates(deviceID))
          device.users?.deviceUsers?.forEach(du => 
            waitList.push(csProvider.unsubscribeFromDeviceUserUpdates(deviceID, du?.user?.userID!))
          );
        }
      );
      await Promise.all(waitList);

      return createFollowUpAction(action, SUCCESS);
    }
  );
}
