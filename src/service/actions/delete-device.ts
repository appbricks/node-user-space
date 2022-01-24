import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  SUCCESS,
  NOOP,
  Action, 
  createAction, 
  createFollowUpAction, 
  serviceEpicFanOut 
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  DeviceIDPayload,
  DELETE_DEVICE,
  GET_USER_DEVICES
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, deviceID: string) => 
    dispatch(createAction(DELETE_DEVICE, <DeviceIDPayload>{ deviceID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<DeviceIDPayload, UserSpaceStateProps>(
    DELETE_DEVICE, 
    {
      deleteDevice: async (action, state$, callSync) => {
        await csProvider.deleteDevice(action.payload!.deviceID);
        return createFollowUpAction(action, SUCCESS);  
      },
      getUserDevices: async (action, state$, callSync) => {
        // wait for activation service call to complete
        let dependsAction = await callSync['deleteDevice'];
        if (dependsAction.type == SUCCESS) {
          return createAction(GET_USER_DEVICES);
        } else {
          return createAction(NOOP);
        }
      }
    }
  );
}
