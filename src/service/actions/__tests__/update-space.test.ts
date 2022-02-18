import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import {
  Space
} from '../../../model/types';
import { 
  SpaceUpdatePayload,
  SpacePayload,
  UPDATE_SPACE
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

it('dispatches an action to update a user\'s space', async () => {

  mockProvider.setLoggedInUser('tom');
  const space = mockProvider.user!.spaces!.spaceUsers![0]!.space!;

  actionTester.expectAction<SpaceUpdatePayload>(UPDATE_SPACE, {
    spaceID: space.spaceID!, 
    spaceKey: {
      publicKey: 'tom\'s space #1 public key updated',
      certificateRequest: 'tom\'s space #1 certificate key updated'
    },
    version: '1.1.1',
    settings: {
      someSetting: 'someValue'
    }
  })
    .success<SpacePayload>({ space });

  dispatch.userspaceService!.updateSpace(
    space.spaceID!, 
    {
      publicKey: 'tom\'s space #1 public key updated',
      certificateRequest: 'tom\'s space #1 certificate key updated'
    },
    '1.1.1',
    {
      someSetting: 'someValue'
    }
  );
  await actionTester.done();

  expect(space).toMatchObject(<Space>{
    ...space,
    publicKey: 'tom\'s space #1 public key updated',
    version: '1.1.1',
    settings: '{"someSetting":"someValue"}'
  });
});
