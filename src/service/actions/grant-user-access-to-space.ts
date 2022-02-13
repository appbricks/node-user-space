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
  SpaceUserIDPayload,
  SpaceUserPayload,
  GRANT_USER_ACCESS_TO_SPACE,
  GET_USER_SPACES
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID: string) => 
    dispatch(createAction(GRANT_USER_ACCESS_TO_SPACE, <SpaceUserIDPayload>{ spaceID, userID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceUserIDPayload, UserSpaceStateProps>(
    GRANT_USER_ACCESS_TO_SPACE, 
    {
      grantUserAccessToSpace: async (action, state$, callSync) => {
        const spaceUser = await csProvider.activateSpaceUser(action.payload!.spaceID, action.payload!.userID!);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for activation service call to complete
        return await onSuccessAction(callSync['grantUserAccessToSpace'], createAction(GET_USER_SPACES));
      }
    }
  );
}
