import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  NOOP,
  SUCCESS,
  Action, 
  createAction, 
  createFollowUpAction, 
  serviceEpicFanOut 
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  DeviceUserIDPayload,
  DeviceUserPayload,
  ACTIVATE_USER_ON_DEVICE,
  GET_USER_DEVICES,
  GET_DEVICE_ACCESS_REQUESTS
} from '../action';
import { UserSpaceStateProps } from '../state';

export const activateUserOnDeviceAction = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string, userID: string) => 
    dispatch(createAction(ACTIVATE_USER_ON_DEVICE, <DeviceUserIDPayload>{ deviceID, userID }));

export const activateUserOnDeviceEpic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<DeviceUserIDPayload, UserSpaceStateProps>(
    ACTIVATE_USER_ON_DEVICE, 
    {
      activateUserOnDevice: async (action, state$, callSync) => {
        const deviceUser = await csProvider.activateDeviceUser(action.payload!.deviceID, action.payload!.userID!);
        return createFollowUpAction<DeviceUserPayload>(action, SUCCESS, { deviceUser });
      },
      getDeviceAccessRequests: async (action, state$, callSync) => {
        // wait for activation service call to complete
        let dependsAction = await callSync['activateUserOnDevice'];
        if (dependsAction.type == SUCCESS) {
          const deviceUser = (<DeviceUserPayload>dependsAction.payload!).deviceUser;
          return createAction(GET_DEVICE_ACCESS_REQUESTS, <DeviceUserIDPayload>{ deviceID: deviceUser.device!.deviceID });
        } else {
          return createAction(NOOP);
        }
      },
      getUserDevices: async (action, state$, callSync) => {
        // wait for activation service call to complete
        let dependsAction = await callSync['activateUserOnDevice'];
        if (dependsAction.type == SUCCESS) {
          return createAction(GET_USER_DEVICES);
        } else {
          return createAction(NOOP);
        }
      }
    }
  );
}
