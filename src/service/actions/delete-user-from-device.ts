import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  SUCCESS,
  Action, 
  createAction, 
  createFollowUpAction, 
  serviceEpicFanOut,
  onSuccessAction
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  DeviceUserIDPayload,
  DeviceUserPayload,
  DELETE_USER_FROM_DEVICE,
  GET_USER_DEVICES
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string, userID: string) => 
    dispatch(createAction(DELETE_USER_FROM_DEVICE, <DeviceUserIDPayload>{ deviceID, userID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<DeviceUserIDPayload, UserSpaceStateProps>(
    DELETE_USER_FROM_DEVICE, {
      deleteUserFromDevice: async (action, state$, callSync) => {
        const deviceUser = await csProvider.deleteDeviceUser(action.payload!.deviceID, action.payload!.userID!);
        return createFollowUpAction<DeviceUserPayload>(action, SUCCESS, { deviceUser });
      },
      getUserDevices: async (action, state$, callSync) => {
        // wait for delete device user service call to complete
        return await onSuccessAction(callSync['deleteUserFromDevice'], createAction(GET_USER_DEVICES));
      }
    }
  );
}
