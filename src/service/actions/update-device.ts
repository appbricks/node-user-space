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
  DeviceUpdatePayload,
  DevicePayload,
  UPDATE_DEVICE,
} from '../actions';
import {
  Key
} from '../../model/types';
import {
  DisplayType
} from '../../model/display';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string, deviceKey?: Key, clientVersion?: string, settings?: DisplayType) => 
    dispatch(createAction<DeviceUpdatePayload>(UPDATE_DEVICE, { deviceID, deviceKey, clientVersion, settings }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpic<DeviceUpdatePayload>(
    UPDATE_DEVICE, 
    async (action, state$) => {
      const { deviceID, deviceKey, clientVersion, settings } = action.payload!;
      const device = await csProvider.updateDevice(deviceID, deviceKey, clientVersion, JSON.stringify(settings));
      return createFollowUpAction<DevicePayload>(action, SUCCESS, { device });
    }
  );
}
