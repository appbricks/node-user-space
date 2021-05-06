import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  SpaceIDPayload,
  SpaceUserPayload,
  SpaceUsersPayload,
  LEAVE_SPACE,
  GET_USER_SPACES
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('leave-space.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('leaves a space', async () => {

  const spaceID = 'af296bd0-1186-42f0-b7ca-90980d22b961'; // bob's space #1

  mockProvider.setLoggedInUser('tom');
  const spaceUser = mockProvider.user!.spaces!.spaceUsers!
    .find(spaceUser => spaceUser!.space!.spaceID == spaceID)!;

  actionTester.expectAction(LEAVE_SPACE, <SpaceIDPayload>{ spaceID })
    .success<SpaceUserPayload>({ spaceUser });
  actionTester.expectAction(GET_USER_SPACES)
    .success<SpaceUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.spaceUsers).toBeDefined();
      return state;
    });

  dispatch.userspaceService!.leaveSpace(spaceID);
  await actionTester.done();

  expect(actionTester.actionCounter).toEqual(2);
});
