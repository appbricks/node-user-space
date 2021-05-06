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
  SpaceIDPayload,
  SpaceUserPayload,
  SpaceUsersPayload,
  ACCEPT_SPACE_INVITATION,
  GET_SPACE_INVITATIONS,
  GET_USER_SPACES
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('accept-space-invitation.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('accept an invitation to connect to a space', async () => {

  const spaceID = 'af296bd0-1186-42f0-b7ca-90980d22b961'; // bob's space #1

  mockProvider.setLoggedInUser('tom');
  const spaceUser = <SpaceUser>mockProvider.user!.spaces!.spaceUsers!
    .find(spaceUser => spaceUser!.space!.spaceID == spaceID);
  expect(spaceUser.status).toEqual(UserAccessStatus.pending);

  actionTester.expectAction(ACCEPT_SPACE_INVITATION, <SpaceIDPayload>{ spaceID })
    .success<SpaceUserPayload>({ spaceUser });
  actionTester.expectAction(GET_SPACE_INVITATIONS)
    .success<SpaceUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.spaceUsers).toBeDefined();
      return state;
    });
  actionTester.expectAction(GET_USER_SPACES)
    .success<SpaceUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.spaceUsers).toBeDefined();
      return state;
    });
  dispatch.userspaceService!.acceptSpaceInvitation(spaceID);
  await actionTester.done();

  expect(actionTester.actionCounter).toEqual(3);
  expect(spaceUser.status).toEqual(UserAccessStatus.active);
});
