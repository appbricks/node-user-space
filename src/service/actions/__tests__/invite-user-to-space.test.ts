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
  SpaceInvitationPayload,
  SpaceUserPayload,
  SpaceUsersPayload,
  INVITE_USER_TO_SPACE,
  GET_USER_SPACES
} from '../../actions';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('invite-user-to-space.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('invite a user to a space owned by the logged in user', async () => {

  const spaceID = 'af296bd0-1186-42f0-b7ca-90980d22b961'; // bob's space #1
  const userID = '95e579be-a365-4268-bed0-17df80ef3dce'; // deb

  mockProvider.setLoggedInUser('bob');
  let spaceUserInvitation: SpaceUser = {
    __typename: 'SpaceUser'
  };
  
  actionTester.expectAction(INVITE_USER_TO_SPACE, 
    <SpaceInvitationPayload>{ spaceID, userID, isAdmin: false, isEgressNode: true }
  )
    .success<SpaceUserPayload>(undefined, 
      (counter, state, action) => {
        spaceUserInvitation = (<SpaceUserPayload>action.payload!).spaceUser;
        expect(spaceUserInvitation.space!.spaceID).toEqual(spaceID);
        expect(spaceUserInvitation.user!.userID).toEqual(userID);
        expect(spaceUserInvitation.status).toEqual(UserAccessStatus.pending);
        return state;
      }
    );
  actionTester.expectAction(GET_USER_SPACES)
    .success<SpaceUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.spaceUsers).toBeDefined();
      return state;
    });

  dispatch.userspaceService!.inviteUserToSpace(spaceID, userID, false, true);
  await actionTester.done();

  const spaceUser = <SpaceUser>mockProvider.user!.spaces!.spaceUsers!
    .find(spaceUser => spaceUser!.space!.spaceID == spaceID)!
      .space!.users!.spaceUsers!
        .find(spaceUser => spaceUser!.user!.userID == userID);

  expect(actionTester.actionCounter).toEqual(2);
  expect(spaceUserInvitation).toEqual(spaceUser);
});
