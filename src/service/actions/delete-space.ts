import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  SUCCESS,
  NOOP,
  Action, 
  createAction, 
  createFollowUpAction, 
  serviceEpicFanOut 
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  SpaceIDPayload,
  DELETE_SPACE,
  GET_USER_SPACES
} from '../action';
import { UserSpaceStateProps } from '../state';

export const deleteSpaceAction = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string) => 
    dispatch(createAction(DELETE_SPACE, <SpaceIDPayload>{ spaceID }));

export const deleteSpaceEpic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceIDPayload, UserSpaceStateProps>(
    DELETE_SPACE, 
    {
      deleteSpace: async (action, state$, callSync) => {
        const space = await csProvider.deleteSpace(action.payload!.spaceID);
        return createFollowUpAction(action, SUCCESS);
      },
      getUserSpaces: async (action, state$, callSync) => {
        let dependsAction = await callSync['deleteSpace'];
        if (dependsAction.type == SUCCESS) {
          return createAction(GET_USER_SPACES);
        } else {
          return createAction(NOOP);
        }
      }
    }
  );
}
