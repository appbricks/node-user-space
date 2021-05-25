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
  GRANT_USER_ACCESS_TO_SPACE,
  GET_USER_SPACES
} from '../action';
import { UserSpaceStateProps } from '../state';

export const grantUserAccessToSpaceAction = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, userID: string) => 
    dispatch(createAction(GRANT_USER_ACCESS_TO_SPACE, <SpaceUserIDPayload>{ spaceID, userID }));

export const grantUserAccessToSpaceEpic = (csProvider: Provider): Epic => {

  return serviceEpicFanOut<SpaceUserIDPayload, UserSpaceStateProps>(
    GRANT_USER_ACCESS_TO_SPACE, 
    {
      grantUserAccessToSpace: async (action, state$, callSync) => {
        const spaceUser = await csProvider.activateSpaceUser(action.payload!.spaceID, action.payload!.userID!);
        return createFollowUpAction<SpaceUserPayload>(action, SUCCESS, { spaceUser });
      },
      getUserSpaces: async (action, state$, callSync) => {
        // wait for activation service call to complete
        let dependsAction = await callSync['grantUserAccessToSpace'];
        if (dependsAction.type == SUCCESS) {
          return createAction(GET_USER_SPACES);
        } else {
          return createAction(NOOP);
        }
      }
    }
  );
}
