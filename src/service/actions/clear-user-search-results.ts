import * as redux from 'redux';

import { 
  createAction, 
} from '@appbricks/utils';

import { 
  CLEAR_USER_SEARCH_RESULTS,
} from '../actions';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>) => 
    dispatch(createAction(CLEAR_USER_SEARCH_RESULTS));
