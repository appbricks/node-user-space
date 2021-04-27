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
  SpaceIDPayload,
  SpaceUserPayload,
  ACCEPT_SPACE_INVITATION,
} from '../action';
import { UserSpaceStateProps } from '../state';

export const acceptSpaceInvitationAction = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string) => 
    dispatch(createAction(ACCEPT_SPACE_INVITATION, <SpaceIDPayload>{ spaceID }));

export const acceptSpaceInvitationEpic = (csProvider: Provider): Epic => {

  return serviceEpic<SpaceIDPayload, UserSpaceStateProps>(
    ACCEPT_SPACE_INVITATION, 
    async (action, state$) => {
      const spaceUser = await csProvider.acceptSpaceUserInvitation(action.payload!.spaceID);
      return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
    }
  );
}
