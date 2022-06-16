import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  SUCCESS,
  Action, 
  createAction, 
  createFollowUpAction, 
  createErrorAction,
  serviceEpicFanOut,
  onSuccessAction
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  AppUserIDPayload,
  AppUserPayload,
  GRANT_USER_ACCESS_TO_APP,
  GET_USER_APPS
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, appID: string, userID: string) => 
    dispatch(createAction(GRANT_USER_ACCESS_TO_APP, <AppUserIDPayload>{ appID, userID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<AppUserIDPayload, UserSpaceStateProps>(
    GRANT_USER_ACCESS_TO_APP, 
    {
      grantUserAccessToApp: async (action, state$, callSync) => {
        const appID = action.payload!.appID;
        const userID = action.payload!.userID!;

        // check if user has access app space
        const app = state$.value.userspace!.
          userApps.find(au => au.app?.appID == appID)?.app;
        
        const spaceUser = state$.value.userspace!.
          userSpaces.find(su => su.space?.spaceID == app?.space?.spaceID)?.space?.users?.
          spaceUsers?.find(su => su?.user?.userID == userID);

        if (spaceUser) {
          const appUser = await csProvider.addAppUser(appID, userID);
          return createFollowUpAction<AppUserPayload>(action, SUCCESS, { appUser });

        } else {
          return createErrorAction(
            new Error('User needs to be invited to the app\'s space before he/she can be added to the app.'), 
            action
          );
        }
      },
      getUserApps: async (action, state$, callSync) => {
        // wait for activation service call to complete
        return await onSuccessAction(callSync['grantUserAccessToApp'], createAction(GET_USER_APPS));
      }
    }
  );
}
