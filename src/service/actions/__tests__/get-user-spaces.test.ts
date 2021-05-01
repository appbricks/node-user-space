import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  SpaceUser,
  UserAccessStatus
} from '../../../model/types';
import { 
  SpaceUsersPayload,
  GET_USER_SPACES 
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('get-user-spaces.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('dispatches an action to retrieve the logged in user tom\'s spaces', async () => {

  mockProvider.setLoggedInUser('tom');
  const spaceUsers = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
    .filter(spaceUser => spaceUser!.status == UserAccessStatus.active);

  actionTester.expectAction(GET_USER_SPACES)
    .success<SpaceUsersPayload>({ spaceUsers });

  dispatch.userspaceService!.getUserSpaces();
  await actionTester.done();
});

it('dispatches an action to retrieve the logged in user bob\'s spaces', async () => {
  
  mockProvider.setLoggedInUser('bob');
  const spaceUsers = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
    .filter(spaceUser => spaceUser!.status == UserAccessStatus.active);

  actionTester.expectAction(GET_USER_SPACES)
    .success<SpaceUsersPayload>({ spaceUsers });

  dispatch.userspaceService!.getUserSpaces();
  await actionTester.done();
});
