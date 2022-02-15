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
  DELETE_USER_FROM_SPACE,
  GET_USER_SPACES
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID?: string) => 
    dispatch(createAction(DELETE_USER_FROM_SPACE, <SpaceUserIDPayload>{ spaceID, userID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceUserIDPayload, UserSpaceStateProps>(
    DELETE_USER_FROM_SPACE, 
    {
      deleteUserFromSpace: async (action, state$, callSync) => {
        const spaceUser = await csProvider.deleteSpaceUser(action.payload!.spaceID, action.payload!.userID!);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for delete space user service call to complete
        return await onSuccessAction(callSync['deleteUserFromSpace'], createAction(GET_USER_SPACES));
      }
    }
  );
}
