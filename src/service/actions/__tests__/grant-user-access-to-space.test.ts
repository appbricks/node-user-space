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
  SpaceUserIDPayload,
  SpaceUserPayload,
  SpaceUsersPayload,
  GRANT_USER_ACCESS_TO_SPACE,
  GET_USER_SPACES
} from '../../actions';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('grant-user-access-to-space.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('grants a user access to a space', async () => {

  const spaceID = 'af296bd0-1186-42f0-b7ca-90980d22b961'; // bobs's space #2
  const userID = 'a645c56e-f454-460f-8324-eff15357e973'; // tom

  mockProvider.setLoggedInUser('bob');
  const spaceUser = <SpaceUser>mockProvider.user!.spaces!.spaceUsers!
    .find(spaceUser => spaceUser!.space!.spaceID == spaceID)!
      .space!.users!.spaceUsers!
        .find(spaceUsers => spaceUsers!.user!.userID == userID);
  expect(spaceUser.status).toEqual(UserAccessStatus.pending);

  actionTester.expectAction(GRANT_USER_ACCESS_TO_SPACE, <SpaceUserIDPayload>{ spaceID, userID })
    .success<SpaceUserPayload>({ spaceUser });
  actionTester.expectAction(GET_USER_SPACES)
    .success<SpaceUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.spaceUsers).toBeDefined();
      return state;
    });

  dispatch.userspaceService!.grantUserAccessToSpace(spaceID, userID);
  await actionTester.done();
  
  expect(actionTester.actionCounter).toEqual(2);
  expect(spaceUser.status).toEqual(UserAccessStatus.active);
});
