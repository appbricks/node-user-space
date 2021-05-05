import * as redux from 'redux';
import { Epic } from 'redux-observable';

import { 
  Action, 
  createAction, 
  serviceEpic 
} from '@appbricks/utils';

import Provider from '../provider';
import { 
  UserSearchPayload,
  USER_SEARCH,
  USER_SEARCH_PAGE_NEXT,
} from '../action';
import { UserSpaceStateProps } from '../state';

import { Cursor } from '../../model/types';

export const userSearchPageNextAction = 
  (dispatch: redux.Dispatch<redux.Action>) => 
    dispatch(createAction(USER_SEARCH_PAGE_NEXT));

export const userSearchPageNextEpic = (): Epic => {

  return serviceEpic<UserSearchPayload, UserSpaceStateProps>(
    USER_SEARCH_PAGE_NEXT, 
    async (action, state$) => {
      const userSearchResult = state$.value.userspace!.userSearchResult;      
      if (!userSearchResult) {
        throw Error('No search results to traverse.'); 
      }
      const { searchPrefix, limit, pageInfo } = userSearchResult;
      if (!pageInfo.hasNextPage) {
        throw Error('No next page available in search results.'); 
      }
      
      return createAction<UserSearchPayload>(USER_SEARCH, {
        namePrefix: searchPrefix,
        limit, 
        cursor: {
          index: (<Cursor>pageInfo.cursor).index!,
          nextTokens: (<Cursor>pageInfo.cursor).nextTokens!
        }
      });
    }
  );
}
