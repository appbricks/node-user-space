import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  SUCCESS,
  Action, 
  createAction, 
  createFollowUpAction, 
  serviceEpic 
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  SpaceUsersPayload,
  GET_SPACE_INVITATIONS,
} from '../action';

export const getSpaceInvitationsAction = 
  (dispatch: redux.Dispatch<redux.Action>) => 
    dispatch(createAction(GET_SPACE_INVITATIONS));

export const getSpaceInvitationsEpic = (csProvider: Provider): Epic => {

  return serviceEpic(
    GET_SPACE_INVITATIONS, 
    async (action, state$) => {
      const spaceUsers = await csProvider.getSpaceInvitations();
      return createFollowUpAction<SpaceUsersPayload>(action, SUCCESS, { spaceUsers });
    }
  );
}
