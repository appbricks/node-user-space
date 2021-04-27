import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  SpaceIDPayload,
  SpacePayload,
  DELETE_SPACE 
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('delete-space.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('deletes a space', async () => {

  const spaceID = 'af296bd0-1186-42f0-b7ca-90980d22b961'; // bob's space #1

  mockProvider.setLoggedInUser('bob');
  const space = mockProvider.user!.spaces!.spaceUsers!
    .find(spaceUser => spaceUser!.space!.spaceID == spaceID)!.space!;

  actionTester.expectAction(DELETE_SPACE, <SpaceIDPayload>{ spaceID })
    .success<SpacePayload>({ space });

  dispatch.userspaceService!.deleteSpace(spaceID);
  await actionTester.done();
});
