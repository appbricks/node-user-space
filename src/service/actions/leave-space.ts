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
  LEAVE_SPACE,
} from '../action';
import { UserSpaceStateProps } from '../state';

export const leaveSpaceAction = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string) => 
    dispatch(createAction(LEAVE_SPACE, <SpaceIDPayload>{ spaceID }));

export const leaveSpaceEpic = (csProvider: Provider): Epic => {

  return serviceEpic<SpaceIDPayload, UserSpaceStateProps>(
    LEAVE_SPACE, 
    async (action, state$) => {
      const spaceUser = await csProvider.leaveSpaceUser(action.payload!.spaceID);
      return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
    }
  );
}
