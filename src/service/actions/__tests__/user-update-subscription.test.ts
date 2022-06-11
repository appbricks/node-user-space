import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
  BROADCAST,
  BroadCastPayload
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  UserUpdate,
} from '../../../model/types';
import { 
  GET_USER_DEVICES,
  GET_USER_SPACES,
} from '../../actions';
import {
  UserSpaceState,
  initialUserSpaceState
} from '../../state';
import {
  UserAccessStatus
} from '../../../model/types';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('user-update-subscription.test');

// test reducer validates action flows
const actionTester = new ActionTester<UserSpaceState>(logger, {
  ...initialUserSpaceState(),
  deviceUpdatesActive: true,
  spaceUpdatesActive: true
});
// test service dispatcher
const { sendLoginEvent, mockProvider } = initServiceDispatch(actionTester);

it('subscribes to updates to user tom', async () => {

  mockProvider.setLoggedInUser('tom');
  const user = mockProvider.user!; // tom's user #1

  const deviceUsers = user.devices?.deviceUsers?.filter(
    deviceUser => deviceUser!.status == UserAccessStatus.active);
  const spaceUsers = user.spaces?.spaceUsers?.filter(
    spaceUser => spaceUser!.status == UserAccessStatus.active);

  actionTester.expectAction<BroadCastPayload>(BROADCAST, { 
    __typename: 'UserLogin', 
    userID: user.userID! 
  });
  actionTester.expectAction<BroadCastPayload>(BROADCAST, { 
    ...user,
    publicKey: 'New public key #1'
  });
  actionTester.expectAction<BroadCastPayload>(BROADCAST, { 
    ...user,
    publicKey: 'New public key #2',
  });
  actionTester.expectAction<BroadCastPayload>(BROADCAST, { 
    ...user,
  });
  actionTester.expectAction(GET_USER_DEVICES)
    .success({ deviceUsers });
  actionTester.expectAction(GET_USER_SPACES)
    .success({ spaceUsers });

  sendLoginEvent!(user.userID!);

  mockProvider.pushSubscriptionUpdate(<UserUpdate>{
    userID: user.userID,
    user: { 
      ...user,
      publicKey: 'New public key #1'
    }
  }, user.userID!)
  mockProvider.pushSubscriptionUpdate(<UserUpdate>{
    userID: user.userID,
    user: { 
      ...user,
      publicKey: 'New public key #2'
    }
  }, user.userID!)
  mockProvider.pushSubscriptionUpdate(<UserUpdate>{
    userID: user.userID,
    numDevices: deviceUsers?.length,
    numSpaces: spaceUsers?.length,
    user: { 
      ...user
    }
  }, user.userID!)
  
  await actionTester.done();
});
