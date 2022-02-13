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
  SpaceUserPayload,
  LEAVE_SPACE,
  GET_USER_SPACES
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string) => 
    dispatch(createAction(LEAVE_SPACE, <SpaceIDPayload>{ spaceID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceIDPayload, UserSpaceStateProps>(
    LEAVE_SPACE, 
    {
      leaveSpace: async (action, state$, callSync) => {
        const spaceUser = await csProvider.leaveSpaceUser(action.payload!.spaceID);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for leave space call to complete
        return await onSuccessAction(callSync['leaveSpace'], createAction(GET_USER_SPACES));
      }
    }
  );
}
