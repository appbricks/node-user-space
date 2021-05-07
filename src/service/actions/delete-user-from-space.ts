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
  SpaceUserIDPayload,
  SpaceUserPayload,
  DELETE_USER_FROM_SPACE,
  GET_USER_SPACES
} from '../action';
import { UserSpaceStateProps } from '../state';

export const deleteUserFromSpaceAction = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID: string) => 
    dispatch(createAction(DELETE_USER_FROM_SPACE, <SpaceUserIDPayload>{ spaceID, userID }));

export const deleteUserFromSpaceEpic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceUserIDPayload, UserSpaceStateProps>(
    DELETE_USER_FROM_SPACE, 
    {
      deleteSpaceUser: async (action, state$, callSync) => {
        const spaceUser = await csProvider.deleteSpaceUser(action.payload!.spaceID, action.payload!.userID!);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getUserSpaces: async (action, state$, callSync) => {
        let dependsAction = await callSync['deleteSpaceUser'];
        if (dependsAction.type == SUCCESS) {
          return createAction(GET_USER_SPACES);
        } else {
          return createAction(NOOP);
        }
      }
    }
  );
}
