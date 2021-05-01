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
  DELETE_SPACE,
} from '../action';
import { UserSpaceStateProps } from '../state';

export const deleteSpaceAction = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string) => 
    dispatch(createAction(DELETE_SPACE, <SpaceIDPayload>{ spaceID }));

export const deleteSpaceEpic = (csProvider: Provider): Epic => {

  return serviceEpic<SpaceIDPayload, UserSpaceStateProps>(
    DELETE_SPACE, 
    async (action, state$) => {
      const space = await csProvider.deleteSpace(action.payload!.spaceID);
      return createFollowUpAction(action, SUCCESS);
    }
  );
}
