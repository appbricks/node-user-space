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
  DeviceIDPayload,
  DELETE_DEVICE,
} from '../action';
import { UserSpaceStateProps } from '../state';

export const deleteDeviceAction = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string) => 
    dispatch(createAction(DELETE_DEVICE, <DeviceIDPayload>{ deviceID }));

export const deleteDeviceEpic = (csProvider: Provider): Epic => {

  return serviceEpic<DeviceIDPayload, UserSpaceStateProps>(
    DELETE_DEVICE, 
    async (action, state$) => {
      await csProvider.deleteDevice(action.payload!.deviceID);
      return createFollowUpAction(action, SUCCESS);
    }
  );
}
