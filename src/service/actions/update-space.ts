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
  SpaceUpdatePayload,
  SpacePayload,
  UPDATE_SPACE,
} from '../actions';
import {
  Key
} from '../../model/types';
import {
  DisplayType
} from '../../model/display';

export const action = 
  (dispatch: redux.Dispatch<redux.Action>, spaceID: string, spaceKey: Key, version: string, settings: DisplayType) => 
    dispatch(createAction<SpaceUpdatePayload>(UPDATE_SPACE, { spaceID, spaceKey, version, settings }));

export const epic = (csProvider: Provider): Epic => {

  return serviceEpic<SpaceUpdatePayload>(
    UPDATE_SPACE, 
    async (action, state$) => {
      const { spaceID, spaceKey, version, settings } = action.payload!;
      const space = await csProvider.updateSpace(spaceID, spaceKey, version, JSON.stringify(settings));
      return createFollowUpAction<SpacePayload>(action, SUCCESS, { space });
    }
  );
}
