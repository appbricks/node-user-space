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
  REMOVE_USER_ACCESS_TO_SPACE,
  GET_USER_SPACES
} from '../action';
import { UserSpaceStateProps } from '../state';

export const removeUserAccessToSpaceAction = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID: string) => 
    dispatch(createAction(REMOVE_USER_ACCESS_TO_SPACE, <SpaceUserIDPayload>{ spaceID, userID }));

export const removeUserAccessToSpaceEpic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceUserIDPayload, UserSpaceStateProps>(
    REMOVE_USER_ACCESS_TO_SPACE, 
    {
      removeUserAccessToSpace: async (action, state$, callSync) => {
        const spaceUser = await csProvider.deactivateSpaceUser(action.payload!.spaceID, action.payload!.userID!);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for activation service call to complete
        let dependsAction = await callSync['removeUserAccessToSpace'];
        if (dependsAction.type == SUCCESS) {
          return createAction(GET_USER_SPACES);
        } else {
          return createAction(NOOP);
        }
      }
    }
  );
}
