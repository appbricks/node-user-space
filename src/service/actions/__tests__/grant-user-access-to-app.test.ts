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
  GRANT_USER_ACCESS_TO_APP,
  GET_USER_APPS
} from '../../actions';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('grant-user-access-to-app.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('grants a user access to a app', async () => {

  const appID = '9371d345-a363-4222-ba95-6840e18453ac'; // bobs's app #2
  const userID = 'a645c56e-f454-460f-8324-eff15357e973'; // tom

  mockProvider.setLoggedInUser('bob');
  let appUser = <AppUser>mockProvider.users!
    .find(user => user.userID == userID)!.apps!.appUsers!
    .find(appUser => appUser!.app!.appID == appID);
  expect(appUser).toBeUndefined();

  actionTester.expectAction(GRANT_USER_ACCESS_TO_APP, <AppUserIDPayload>{ appID, userID })
    .success<AppUserPayload>({ 
      appUser: {
        __typename: "AppUser",
        app: { __typename: "App", appID },
        user: { __typename: "User", userID }
      }
    });
  actionTester.expectAction(GET_USER_APPS)
    .success<AppUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.appUsers).toBeDefined();
      return state;
    });

  dispatch.userspaceService!.grantUserAccessToApp(appID, userID);
  await actionTester.done();
  
  expect(actionTester.actionCounter).toEqual(2);

  appUser = <AppUser>mockProvider.user!.apps!.appUsers!
    .find(appUser => appUser!.app!.appID == appID)!
      .app!.users!.appUsers!
        .find(appUsers => appUsers!.user!.userID == userID);
  expect(appUser).toBeDefined();
  expect(appUser.user!.userID).toEqual(userID);
});
