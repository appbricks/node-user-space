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
  ACTIVATE_USER_ON_DEVICE,
} from '../action';
import { UserSpaceStateProps } from '../state';

export const activateUserOnDeviceAction = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string, userID: string) => 
    dispatch(createAction(ACTIVATE_USER_ON_DEVICE, <DeviceUserIDPayload>{ deviceID, userID }));

export const activateUserOnDeviceEpic = (csProvider: Provider): Epic => {

  return serviceEpic<DeviceUserIDPayload, UserSpaceStateProps>(
    ACTIVATE_USER_ON_DEVICE, 
    async (action, state$) => {
      const deviceUser = await csProvider.activateDeviceUser(action.payload!.deviceID, action.payload!.userID!);
      return createFollowUpAction<DeviceUserPayload>(action, SUCCESS, { deviceUser });
    }
  );
}
