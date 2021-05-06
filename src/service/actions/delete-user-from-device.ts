import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  SUCCESS,
  NOOP,
  Action, 
  createAction, 
  createFollowUpAction, 
  serviceEpicFanOut 
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  DeviceUserIDPayload,
  DeviceUserPayload,
  DELETE_USER_FROM_DEVICE,
  GET_USER_DEVICES,
  GET_DEVICE_ACCESS_REQUESTS
} from '../action';
import { UserSpaceStateProps } from '../state';

export const deleteUserFromDeviceAction = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string, userID: string) => 
    dispatch(createAction(DELETE_USER_FROM_DEVICE, <DeviceUserIDPayload>{ deviceID, userID }));

export const deleteUserFromDeviceEpic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<DeviceUserIDPayload, UserSpaceStateProps>(
    DELETE_USER_FROM_DEVICE, {
      deleteUserFromDevice: async (action, state$, callSync) => {
        const deviceUser = await csProvider.deleteDeviceUser(action.payload!.deviceID, action.payload!.userID!);
        return createFollowUpAction<DeviceUserPayload>(action, SUCCESS, { deviceUser });
      },
      getUserDevices: async (action, state$, callSync) => {
        // wait for activation service call to complete
        let dependsAction = await callSync['deleteUserFromDevice'];
        if (dependsAction.type == SUCCESS) {
          return createAction(GET_USER_DEVICES);
        } else {
          return createAction(NOOP);
        }
      },
      getDeviceAccessRequests: async (action, state$, callSync) => {
        // wait for activation service call to complete
        let dependsAction = await callSync['deleteUserFromDevice'];
        if (dependsAction.type == SUCCESS) {
          const deviceUser = (<DeviceUserPayload>dependsAction.payload!).deviceUser;
          return createAction(GET_DEVICE_ACCESS_REQUESTS, <DeviceUserIDPayload>{ deviceID: deviceUser.device!.deviceID });
        } else {
          return createAction(NOOP);
        }
      },
    }
  );
}
