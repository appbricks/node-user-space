import * as redux from 'redux';

import { 
  createAction, 
} from '@appbricks/utils';

import { 
  CLEAR_USER_SEARCH_RESULTS,
} from '../action';

export const clearUserSearchResultsAction = 
  (dispatch: redux.Dispatch<redux.Action>) => 
    dispatch(createAction(CLEAR_USER_SEARCH_RESULTS));
