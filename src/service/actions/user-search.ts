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
  UserSearchPayload,
  UserSearchResultPayload,
  USER_SEARCH,
} from '../action';
import { UserSpaceStateProps } from '../state';

export const userSearchAction = 
  (dispatch: redux.Dispatch<redux.Action>, namePrefix: string) => 
    dispatch(createAction(USER_SEARCH, <UserSearchPayload>{ namePrefix }));

export const userSearchEpic = (csProvider: Provider): Epic => {

  return serviceEpic<UserSearchPayload, UserSpaceStateProps>(
    USER_SEARCH, 
    async (action, state$) => {
      const userSearchResult = await csProvider.userSearch(action.payload!.namePrefix);
      return createFollowUpAction<UserSearchResultPayload>(action, SUCCESS, { userSearchResult });
    }
  );
}
