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
  GET_USER_SPACES,
} from '../action';

export const getUserSpacesAction = 
  (dispatch: redux.Dispatch<redux.Action>) => 
    dispatch(createAction(GET_USER_SPACES));

export const getUserSpacesEpic = (csProvider: Provider): Epic => {

  return serviceEpic(
    GET_USER_SPACES, 
    async (action, state$) => {
      const spaceUsers = await csProvider.getUserSpaces();
      return createFollowUpAction<SpaceUsersPayload>(action, SUCCESS, { spaceUsers });
    }
  );
}
