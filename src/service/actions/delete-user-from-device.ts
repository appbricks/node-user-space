import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  SUCCESS,
  Action, 
  createAction, 
  createFollowUpAction, 
  serviceEpic 
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  DeviceUserIDPayload,
  DeviceUserPayload,
  DELETE_USER_FROM_DEVICE,
} from '../action';
import { UserSpaceStateProps } from '../state';

export const deleteUserFromDeviceAction = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string, userID: string) => 
    dispatch(createAction(DELETE_USER_FROM_DEVICE, <DeviceUserIDPayload>{ deviceID, userID }));

export const deleteUserFromDeviceEpic = (csProvider: Provider): Epic => {

  return serviceEpic<DeviceUserIDPayload, UserSpaceStateProps>(
    DELETE_USER_FROM_DEVICE, 
    async (action, state$) => {
      const deviceUser = await csProvider.deleteDeviceUser(action.payload!.deviceID, action.payload!.userID!);
      return createFollowUpAction<DeviceUserPayload>(action, SUCCESS, { deviceUser });
    }
  );
}
