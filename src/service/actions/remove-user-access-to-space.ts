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
  SpaceUserIDPayload,
  SpaceUserPayload,
  REMOVE_USER_ACCESS_TO_SPACE,
} from '../action';
import { UserSpaceStateProps } from '../state';

export const removeUserAccessToSpaceAction = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID: string) => 
    dispatch(createAction(REMOVE_USER_ACCESS_TO_SPACE, <SpaceUserIDPayload>{ spaceID, userID }));

export const removeUserAccessToSpaceEpic = (csProvider: Provider): Epic => {

  return serviceEpic<SpaceUserIDPayload, UserSpaceStateProps>(
    REMOVE_USER_ACCESS_TO_SPACE, 
    async (action, state$) => {
      const spaceUser = await csProvider.deactivateSpaceUser(action.payload!.spaceID, action.payload!.userID!);
      return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
    }
  );
}
