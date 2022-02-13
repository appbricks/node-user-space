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
  ACCEPT_SPACE_INVITATION,
  GET_USER_SPACES,
  GET_SPACE_INVITATIONS
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string) => 
    dispatch(createAction(ACCEPT_SPACE_INVITATION, <SpaceIDPayload>{ spaceID }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceIDPayload, UserSpaceStateProps>(
    ACCEPT_SPACE_INVITATION,
    {
      acceptSpaceInvitation: async (action, state$, callSync) => {
        const spaceUser = await csProvider.acceptSpaceUserInvitation(action.payload!.spaceID);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getSpaceInvitations: async (action, state$, callSync) => {
        // wait for accept service call to complete
        return await onSuccessAction(callSync['acceptSpaceInvitation'], createAction(GET_SPACE_INVITATIONS));
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for accept service call to complete
        return await onSuccessAction(callSync['acceptSpaceInvitation'], createAction(GET_USER_SPACES));
      }
    }
  );
}
