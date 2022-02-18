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
  SpaceUserUpdatePayload,
  SpaceUserPayload,
  UPDATE_SPACE_USER,
} from '../actions';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID?: string, isEgressNode?: boolean) => 
    dispatch(createAction<SpaceUserUpdatePayload>(UPDATE_SPACE_USER, { spaceID, userID, isEgressNode }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpic<SpaceUserUpdatePayload>(
    UPDATE_SPACE_USER, 
    async (action, state$) => {
      const { spaceID, userID, isEgressNode } = action.payload!;
      const spaceUser = await csProvider.updateSpaceUser(spaceID, userID, isEgressNode);
      return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
    }
  );
}
