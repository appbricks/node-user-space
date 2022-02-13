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
  REMOVE_USER_ACCESS_TO_SPACE,
  GET_USER_SPACES
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID: string) => 
    dispatch(createAction(REMOVE_USER_ACCESS_TO_SPACE, <SpaceUserIDPayload>{ spaceID, userID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceUserIDPayload, UserSpaceStateProps>(
    REMOVE_USER_ACCESS_TO_SPACE, 
    {
      removeUserAccessToSpace: async (action, state$, callSync) => {
        const spaceUser = await csProvider.deactivateSpaceUser(action.payload!.spaceID, action.payload!.userID!);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for deactivation service call to complete
        return await onSuccessAction(callSync['removeUserAccessToSpace'], createAction(GET_USER_SPACES));
      }
    }
  );
}
