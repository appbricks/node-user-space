import * as redux from 'redux';
import { Epic } from 'redux-observable';

import {
  RESET_STATE,
  NOOP,
  serviceEpic,
  createAction
} from '@appbricks/utils';

import Provider from '../provider';

export const epic = (csProvider: Provider): Epic => {

  return serviceEpic(
    RESET_STATE,
    async (action, state$) => {
      await csProvider.unsubscribeAll();
      return createAction(NOOP);
    }
  );
}
