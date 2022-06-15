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
  AppUserIDPayload,
  AppUserPayload,
  REMOVE_USER_ACCESS_TO_APP,
  GET_USER_APPS
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, appID: string, userID: string) => 
    dispatch(createAction(REMOVE_USER_ACCESS_TO_APP, <AppUserIDPayload>{ appID, userID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<AppUserIDPayload, UserSpaceStateProps>(
    REMOVE_USER_ACCESS_TO_APP, 
    {
      removeUserAccessToApp: async (action, state$, callSync) => {
        const appUser = await csProvider.deleteAppUser(action.payload!.appID, action.payload!.userID!);
        return createFollowUpAction<AppUserPayload>(action, SUCCESS, { appUser });
      },
      getUserApps: async (action, state$, callSync) => {
        // wait for deactivation service call to complete
        return await onSuccessAction(callSync['removeUserAccessToApp'], createAction(GET_USER_APPS));
      }
    }
  );
}
