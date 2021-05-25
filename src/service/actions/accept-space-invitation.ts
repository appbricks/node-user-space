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
  SpaceIDPayload,
  SpaceUserPayload,
  ACCEPT_SPACE_INVITATION,
  GET_USER_SPACES,
  GET_SPACE_INVITATIONS
} from '../action';
import { UserSpaceStateProps } from '../state';

export const acceptSpaceInvitationAction = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string) => 
    dispatch(createAction(ACCEPT_SPACE_INVITATION, <SpaceIDPayload>{ spaceID }));

export const acceptSpaceInvitationEpic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceIDPayload, UserSpaceStateProps>(
    ACCEPT_SPACE_INVITATION,
    {
      acceptSpaceInvitation: async (action, state$, callSync) => {
        const spaceUser = await csProvider.acceptSpaceUserInvitation(action.payload!.spaceID);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getSpaceInvitations: async (action, state$, callSync) => {
        // wait for accept service call to complete
        let dependsAction = await callSync['acceptSpaceInvitation'];
        if (dependsAction.type == SUCCESS) {
          return createAction(GET_SPACE_INVITATIONS);
        } else {
          return createAction(NOOP);
        }
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for accept service call to complete
        let dependsAction = await callSync['acceptSpaceInvitation'];
        if (dependsAction.type == SUCCESS) {
          return createAction(GET_USER_SPACES);
        } else {
          return createAction(NOOP);
        }
      }
    }
  );
}
