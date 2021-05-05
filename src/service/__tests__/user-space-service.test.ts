import * as redux from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import { 
  Logger,
  LOG_LEVEL_TRACE, 
  setLogLevel, 
  reduxLogger, 
  combineEpicsWithGlobalErrorHandler, 
  setLocalStorageImpl, 
  ActionResult
} from '@appbricks/utils';
import { StateTester } from '@appbricks/test-utils';

import {
  UserSpaceActionProps,
  USER_SEARCH,
  GET_USER_DEVICES,
  GET_DEVICE_ACCESS_REQUESTS,
  ACTIVATE_USER_ON_DEVICE,
  DELETE_USER_FROM_DEVICE,
  DELETE_DEVICE,
  GET_USER_DEVICE_TELEMETRY,
  GET_USER_SPACES,
  INVITE_USER_TO_SPACE,
  REMOVE_USER_ACCESS_TO_SPACE,
  DELETE_SPACE,
  GET_USER_SPACE_TELEMETRY,
  GET_SPACE_INVITATIONS,
  ACCEPT_SPACE_INVITATION,
  LEAVE_SPACE,
  GET_USER_APPS,
  GET_APP_INVITATIONS,
  GET_USER_APP_TELEMETRY,
} from '../action';
import { UserSpaceState } from '../state';
import UserSpaceService from '../user-space-service';

import MockProvider from './mock-provider';

if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('auth-service-reducer.test');

// Local store implementation
const localStore: { [key: string]: Object } = {};

const stateTester = new StateTester<UserSpaceState>(logger);
let mockProvider = new MockProvider();

let getState: () => UserSpaceState;

let dispatch: UserSpaceActionProps;

beforeEach(async () => {

  const userspaceService = new UserSpaceService(mockProvider);

  // initialize redux store
  let rootReducer = redux.combineReducers({
    userspace: userspaceService.reducer()
  });

  let epicMiddleware = createEpicMiddleware();
  const store = redux.createStore(
    rootReducer,
    redux.applyMiddleware(reduxLogger, epicMiddleware)
  );

  let rootEpic = combineEpicsWithGlobalErrorHandler(userspaceService.epics());
  epicMiddleware.run(rootEpic);
  
  getState = () => store.getState().userspace;
  store.subscribe(
    stateTester.test(getState)
  );

  dispatch = UserSpaceService.dispatchProps(<redux.Dispatch<redux.Action>>store.dispatch);
})

it('retrieves a users list of users', async () => {

  stateTester.expectStateTest(
    USER_SEARCH, ActionResult.pending,
    (counter, state, status) => {
      expect(status.timestamp).toBeGreaterThan(0);
    }
  );
  // stateTester.expectStateTest(
  //   USER_SEARCH, ActionResult.success,
  //   (counter, state, status) => {
  //     expect(state.userSearchResults)
  //   }
  // );
  dispatch.userspaceService!.userSearch('d');
  await stateTester.done();
});