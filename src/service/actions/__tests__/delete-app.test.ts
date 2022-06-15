import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  AppIDPayload,
  AppUsersPayload,
  DELETE_APP,
  GET_USER_APPS
} from '../../actions';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('delete-app.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('deletes a app', async () => {

  const appID = '9371d345-a363-4222-ba95-6840e18453ac'; // bobs's app #2

  mockProvider.setLoggedInUser('bob');
  expect(mockProvider.user!.apps!.appUsers!
    .find(appUser => appUser!.app!.appID == appID)
  ).toBeDefined();

  actionTester.expectAction(DELETE_APP, <AppIDPayload>{ appID })
    .success();
  actionTester.expectAction(GET_USER_APPS)
    .success<AppUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.appUsers).toBeDefined();
      return state;
    });

  dispatch.userspaceService!.deleteApp(appID);
  await actionTester.done();

  expect(actionTester.actionCounter).toEqual(2);
  expect(mockProvider.user!.apps!.appUsers!
    .find(appUser => appUser!.app!.appID == appID)
  ).toBeUndefined();
});
