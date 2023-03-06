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
  DeviceSpaceAccessConfigPayload,
  SET_DEVICE_SPACE_ACCESS_CONFIG
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string, spaceID: string, viewed: boolean) => 
    dispatch(createAction(SET_DEVICE_SPACE_ACCESS_CONFIG, <DeviceSpaceAccessConfigPayload>{ deviceID, spaceID, viewed }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpic<DeviceSpaceAccessConfigPayload, UserSpaceStateProps>(
    SET_DEVICE_SPACE_ACCESS_CONFIG, 
    async (action, state$) => {
      const deviceUser = await csProvider.setDeviceSpaceAccessConfig(
        action.payload!.deviceID,
        action.payload!.spaceID,
        action.payload!.viewed
      );
      return createFollowUpAction(action, SUCCESS);
    }
  );
}
