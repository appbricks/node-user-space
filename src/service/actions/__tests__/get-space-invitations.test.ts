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
  GET_SPACE_INVITATIONS 
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('get-space-invitations.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('dispatches an action to retrieve space invitations for logged in user tom', async () => {

  mockProvider.setLoggedInUser('tom');
  const spaceUsers = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
    .filter(spaceUsers => spaceUsers!.status == UserAccessStatus.pending);

  actionTester.expectAction(GET_SPACE_INVITATIONS)
    .success<SpaceUsersPayload>({ spaceUsers });

  dispatch.userspaceService!.getSpaceInvitations();
  await actionTester.done();
});

it('dispatches an action to retrieve space invitations for logged in user bob', async () => {

  mockProvider.setLoggedInUser('bob');
  const spaceUsers = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
    .filter(spaceUsers => spaceUsers!.status == UserAccessStatus.pending);

  actionTester.expectAction(GET_SPACE_INVITATIONS)
    .success<SpaceUsersPayload>({ spaceUsers });

  dispatch.userspaceService!.getSpaceInvitations();
  await actionTester.done();
});
