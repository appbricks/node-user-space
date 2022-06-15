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
  AppIDPayload,
  DELETE_APP,
  GET_USER_APPS
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, appID: string) => 
    dispatch(createAction(DELETE_APP, <AppIDPayload>{ appID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<AppIDPayload, UserSpaceStateProps>(
    DELETE_APP, 
    {
      deleteApp: async (action, state$, callSync) => {
        const app = await csProvider.deleteApp(action.payload!.appID);
        return createFollowUpAction(action, SUCCESS);
      },
      getUserApps: async (action, state$, callSync) => {
        // wait for delete app service call to complete
        return await onSuccessAction(callSync['deleteApp'], createAction(GET_USER_APPS));
      }
    }
  );
}
