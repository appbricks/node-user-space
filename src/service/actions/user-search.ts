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
  (dispatch: redux.Dispatch<redux.Action>, namePrefix: string, limit?: number) => 
    dispatch(createAction(USER_SEARCH, <UserSearchPayload>{ namePrefix, limit }));

export const userSearchEpic = (csProvider: Provider): Epic => {

  return serviceEpic<UserSearchPayload, UserSpaceStateProps>(
    USER_SEARCH, 
    async (action, state$) => {
      const payload = action.payload!;
      const userSearchResult = await csProvider.userSearch(payload.namePrefix, payload.limit, payload.cursor);
      return createFollowUpAction<UserSearchResultPayload>(action, SUCCESS, { userSearchResult });
    }
  );
}
