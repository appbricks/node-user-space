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
  DELETE_USER_FROM_SPACE,
  GET_USER_SPACES
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('delete-space-user.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('deletes a user from a space', async () => {

  const spaceID = 'd83b7d95-5681-427d-a65a-5d8a868d72e9'; // toms's space #2
  const userID = '95e579be-a365-4268-bed0-17df80ef3dce'; // deb

  mockProvider.setLoggedInUser('tom');
  const spaceUser = <SpaceUser>mockProvider.user!.spaces!.spaceUsers!
    .find(spaceUser => spaceUser!.space!.spaceID == spaceID)!
      .space!.users!.spaceUsers!
        .find(spaceUsers => spaceUsers!.user!.userID == userID);
  expect(spaceUser.status).toEqual(UserAccessStatus.active);

  actionTester.expectAction(DELETE_USER_FROM_SPACE, <SpaceUserIDPayload>{ spaceID, userID })
    .success<SpaceUserPayload>({ spaceUser });
  actionTester.expectAction(GET_USER_SPACES)
    .success<SpaceUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.spaceUsers).toBeDefined();
      return state;
    });

  dispatch.userspaceService!.deleteUserFromSpace(spaceID, userID);
  await actionTester.done();

  expect(actionTester.actionCounter).toEqual(2);
});
