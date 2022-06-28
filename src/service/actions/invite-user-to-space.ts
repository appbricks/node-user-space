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
  SpaceInvitationPayload,
  SpaceUserPayload,
  SpaceUserSettings,
  INVITE_USER_TO_SPACE,
  GET_USER_SPACES
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID: string, settings: SpaceUserSettings) => 
    dispatch(createAction(INVITE_USER_TO_SPACE, <SpaceInvitationPayload>{ spaceID, userID, settings }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceInvitationPayload, UserSpaceStateProps>(
    INVITE_USER_TO_SPACE, 
    {
      inviteUserToSpace: async (action, state$, callSync) => {
        const args = action.payload!;
        const spaceUser = await csProvider.inviteSpaceUser(args.spaceID, args.userID, args.settings);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for invite service call to complete
        return await onSuccessAction(callSync['inviteUserToSpace'], createAction(GET_USER_SPACES));
      }
    }
  );
}
