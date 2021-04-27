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
  SpaceInvitationPayload,
  SpaceUserPayload,
  INVITE_USER_TO_SPACE,
} from '../action';
import { UserSpaceStateProps } from '../state';

export const inviteUserToSpaceAction = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean) => 
    dispatch(createAction(INVITE_USER_TO_SPACE, <SpaceInvitationPayload>{ spaceID, userID, isAdmin, isEgressNode }));

export const inviteUserToSpaceEpic = (csProvider: Provider): Epic => {

  return serviceEpic<SpaceInvitationPayload, UserSpaceStateProps>(
    INVITE_USER_TO_SPACE, 
    async (action, state$) => {
      const args = action.payload!;
      const spaceUser = await csProvider.inviteSpaceUser(args.spaceID, args.userID, args.isAdmin, args.isEgressNode);
      return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
    }
  );
}
