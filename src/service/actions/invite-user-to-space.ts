import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  NOOP,
  SUCCESS,
  Action, 
  createAction, 
  createFollowUpAction, 
  serviceEpicFanOut 
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  SpaceInvitationPayload,
  SpaceUserPayload,
  INVITE_USER_TO_SPACE,
  GET_USER_SPACES
} from '../actions';
import { UserSpaceStateProps } from '../state';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean) => 
    dispatch(createAction(INVITE_USER_TO_SPACE, <SpaceInvitationPayload>{ spaceID, userID, isAdmin, isEgressNode }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceInvitationPayload, UserSpaceStateProps>(
    INVITE_USER_TO_SPACE, 
    {
      inviteUserToSpace: async (action, state$, callSync) => {
        const args = action.payload!;
        const spaceUser = await csProvider.inviteSpaceUser(args.spaceID, args.userID, args.isAdmin, args.isEgressNode);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for invite service call to complete
        let dependsAction = await callSync['inviteUserToSpace'];
        if (dependsAction.type == SUCCESS) {
          return createAction(GET_USER_SPACES);
        } else {
          return createAction(NOOP);
        }
      }
    }
  );
}
