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
  SpaceIDPayload,
  DELETE_SPACE,
  GET_USER_SPACES
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string) => 
    dispatch(createAction(DELETE_SPACE, <SpaceIDPayload>{ spaceID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceIDPayload, UserSpaceStateProps>(
    DELETE_SPACE, 
    {
      deleteSpace: async (action, state$, callSync) => {
        const space = await csProvider.deleteSpace(action.payload!.spaceID);
        return createFollowUpAction(action, SUCCESS);
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for delete space service call to complete
        return await onSuccessAction(callSync['deleteSpace'], createAction(GET_USER_SPACES));
      }
    }
  );
}
