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
  ACTIVATE_USER_ON_DEVICE,
  GET_USER_DEVICES,
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string, userID: string) => 
    dispatch(createAction(ACTIVATE_USER_ON_DEVICE, <DeviceUserIDPayload>{ deviceID, userID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<DeviceUserIDPayload, UserSpaceStateProps>(
    ACTIVATE_USER_ON_DEVICE, 
    {
      activateUserOnDevice: async (action, state$, callSync) => {
        const deviceUser = await csProvider.activateDeviceUser(action.payload!.deviceID, action.payload!.userID!);
        return createFollowUpAction<DeviceUserPayload>(action, SUCCESS, { deviceUser });
      },
      getUserDevices: async (action, state$, callSync) => {
        // wait for activation service call to complete
        return await onSuccessAction(callSync['activateUserOnDevice'], createAction(GET_USER_DEVICES));
      }
    }
  );
}
