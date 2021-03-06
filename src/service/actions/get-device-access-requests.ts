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
  DeviceUsersPayload,
  GET_DEVICE_ACCESS_REQUESTS,
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string) => 
    dispatch(createAction(GET_DEVICE_ACCESS_REQUESTS, <DeviceUserIDPayload>{ deviceID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpic<DeviceUserIDPayload, UserSpaceStateProps>(
    GET_DEVICE_ACCESS_REQUESTS, 
    async (action, state$) => {
      const deviceUsers = await csProvider.getDeviceAccessRequests(action.payload!.deviceID);
      return createFollowUpAction<DeviceUsersPayload>(action, SUCCESS, { deviceUsers });
    }
  );
}
