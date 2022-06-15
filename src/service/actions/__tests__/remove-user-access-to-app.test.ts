import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  AppUser,
  UserAccessStatus
} from '../../../model/types';
import { 
  AppUserIDPayload,
  AppUserPayload,
  AppUsersPayload,
  REMOVE_USER_ACCESS_TO_APP,
  GET_USER_APPS
} from '../../actions';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('remove-user-access-to-app.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('removes a user\'s access to a app', async () => {

  const appID = '80bc5a59-03d6-4cd8-9156-2b9e5fbbcbb2'; // toms's app #2
  const userID = '8e0a1535-bf9e-4548-8602-ce3b0f619734'; // danny

  mockProvider.setLoggedInUser('tom');
  let appUser = <AppUser>mockProvider.user!.apps!.appUsers!
    .find(appUser => appUser!.app!.appID == appID)!
      .app!.users!.appUsers!
        .find(appUsers => appUsers!.user!.userID == userID);
  expect(appUser).toBeDefined();

  actionTester.expectAction(REMOVE_USER_ACCESS_TO_APP, <AppUserIDPayload>{ appID, userID })
    .success<AppUserPayload>({ appUser });
  actionTester.expectAction(GET_USER_APPS)
    .success<AppUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.appUsers).toBeDefined();
      return state;
    });

  dispatch.userspaceService!.removeUserAccessToApp(appID, userID);
  await actionTester.done();
  
  expect(actionTester.actionCounter).toEqual(2);

  appUser = <AppUser>mockProvider.users!
    .find(user => user.userID == userID)!.apps!.appUsers!
    .find(appUser => appUser!.app!.appID == appID);
  expect(appUser).toBeUndefined();
});
