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
  DeviceUsersPayload,
  DeviceUpdateSubscriptionPayload,
  DeviceTelemetrySubscriptionPayload,
  GET_USER_DEVICES,
  SUBSCRIBE_TO_DEVICE_UPDATES,
  SUBSCRIBE_TO_DEVICE_TELEMETRY
} from '../actions';
import {
  UserSpaceStateProps
} from '../state';

export const action =
  (dispatch: redux.Dispatch<redux.Action>) =>
    dispatch(createAction(GET_USER_DEVICES));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<void, UserSpaceStateProps>(
    GET_USER_DEVICES,
    {
      getUserDevices: async (action, state$, callSync) => {
        const deviceUsers = await csProvider.getUserDevices();
        return createFollowUpAction<DeviceUsersPayload>(action, SUCCESS, { deviceUsers });
      },
      subscribeToDeviceUpdates: async (action, state$, callSync) => {
        let dependsAction: Action;
        try {
          dependsAction = await callSync['getUserDevices'];
        } catch (error) {
          return createAction(NOOP);
        }
        
        if (dependsAction.type == SUCCESS) {

          const [ unsubscribeDevices, subscribeDevices ] = calculateDiffs(
            state$.value.userspace!.userDevices.map(du => du.device!.deviceID!),
            (<DeviceUsersPayload>dependsAction.payload).deviceUsers.map(du => du.device!.deviceID!)
          );
          if (unsubscribeDevices.length > 0 || subscribeDevices.length > 0) {
            return createAction<DeviceUpdateSubscriptionPayload>(SUBSCRIBE_TO_DEVICE_UPDATES, {
              subscribeDevices, unsubscribeDevices
            });              
          }
        }
        return createAction(NOOP);
      },
      subscribeToDeviceTelemetry: async (action, state$, callSync) => {
        let dependsAction: Action;
        try {
          dependsAction = await callSync['getUserDevices'];
        } catch (error) {
          return createAction(NOOP);
        }

        if (dependsAction.type == SUCCESS) {

          const [ unsubscribeDeviceUsers, subscribeDeviceUsers ] = calculateDiffs(
            state$.value.userspace!.userDevices.flatMap(
              du1 => du1.device!.users!.deviceUsers!.map(
                du2 => du1!.device!.deviceID! + '|' + du2!.user!.userID!
              )
            ),
            (<DeviceUsersPayload>dependsAction.payload).deviceUsers.flatMap(
              du1 => du1.device!.users!.deviceUsers!.map(
                du2 => du1!.device!.deviceID! + '|' + du2!.user!.userID!
              )
            )
          );
          if (unsubscribeDeviceUsers.length > 0 || subscribeDeviceUsers.length > 0) {
            return createAction<DeviceTelemetrySubscriptionPayload>(SUBSCRIBE_TO_DEVICE_TELEMETRY, {
              subscribeDeviceUsers: subscribeDeviceUsers.map(
                v => {
                  const s = v.split('|');
                  return { deviceID: s[0], userID: s[1]};
                }
              ),
              unsubscribeDeviceUsers: unsubscribeDeviceUsers.map(
                v => {
                  const s = v.split('|');
                  return { deviceID: s[0], userID: s[1]};
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
