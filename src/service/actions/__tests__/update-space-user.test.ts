import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import {
  SpaceUser
} from '../../../model/types';
import { 
  UPDATE_SPACE_USER, 
  SpaceUserUpdatePayload,
  SpaceUserPayload
} from '../../actions';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('update-space.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('dispatches an action to update a space user', async () => {

  mockProvider.setLoggedInUser('tom');
  const spaceUser = mockProvider.user!.spaces!.spaceUsers![0]!;

  actionTester.expectAction<SpaceUserUpdatePayload>(UPDATE_SPACE_USER, {
    spaceID: spaceUser.space!.spaceID!, 
    userID: spaceUser.user!.userID!, 
    settings: { canUseSpaceForEgress: false }
  })
    .success<SpaceUserPayload>({ spaceUser });

  dispatch.userspaceService!.updateSpaceUser(
    spaceUser.space!.spaceID!, 
    spaceUser.user!.userID!, 
    { canUseSpaceForEgress: false }
  );
  await actionTester.done();

  expect(spaceUser).toMatchObject(<SpaceUser>{
    ...spaceUser,
    canUseSpaceForEgress: false
  })
});
