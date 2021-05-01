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
  DeviceUsersPayload,
  GET_USER_DEVICES,
} from '../action';

export const getUserDevicesAction = 
  (dispatch: redux.Dispatch<redux.Action>) => 
    dispatch(createAction(GET_USER_DEVICES));

export const getUserDevicesEpic = (csProvider: Provider): Epic => {

  return serviceEpic(
    GET_USER_DEVICES, 
    async (action, state$) => {
      const deviceUsers = await csProvider.getUserDevices();
      return createFollowUpAction<DeviceUsersPayload>(action, SUCCESS, { deviceUsers });
    }
  );
}
