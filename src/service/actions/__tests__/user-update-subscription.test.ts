import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  UserUpdate,
} from '../../../model/types';
import { 
  UserIDPayload,
  UserPayload,
  SUBSCRIBE_TO_USER_UPDATES,
  USER_UPDATE,
  GET_USER_DEVICES,
  GET_USER_SPACES,
  UNSUBSCRIBE_FROM_USER_UPDATES
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
const actionTester = new ActionTester<UserSpaceState>(logger, initialUserSpaceState());
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('subscribes to updates to user tom', async () => {

  mockProvider.setLoggedInUser('tom');
  const user = mockProvider.user!; // tom's user #1

  const deviceUsers = user.devices?.deviceUsers?.filter(
    deviceUser => deviceUser!.status == UserAccessStatus.active);
  const spaceUsers = user.spaces?.spaceUsers?.filter(
    spaceUser => spaceUser!.status == UserAccessStatus.active);

  actionTester.expectAction<UserIDPayload>(SUBSCRIBE_TO_USER_UPDATES, { userID: user.userID! } )
    .success();
  actionTester.expectAction<UserPayload>(USER_UPDATE, { 
    user: { 
      ...user,
      publicKey: 'New public key #1'
    }
  });
  actionTester.expectAction<UserPayload>(USER_UPDATE, { 
    user: { 
      ...user,
      publicKey: 'New public key #2',
    }
  });
  actionTester.expectAction<UserPayload>(USER_UPDATE, { 
    user: { 
      ...user,
    }
  });
  actionTester.expectAction(GET_USER_DEVICES)
    .success({ deviceUsers });
  actionTester.expectAction(GET_USER_SPACES)
    .success({ spaceUsers });
  actionTester.expectAction<UserIDPayload>(UNSUBSCRIBE_FROM_USER_UPDATES, { userID: user.userID! } )
    .success();

  dispatch.userspaceService!.subscribeToUserUpdates(user.userID!);

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

  dispatch.userspaceService!.unsubscribeFromUserUpdates(user.userID!);

  try {
    mockProvider.pushSubscriptionUpdate(<UserUpdate>{
      userID: user.userID,
      user: { 
        ...user,
        publicKey: 'New public key #3'
      }
    }, user.userID!)  
    throw new Error('subscription not found error expected');

  } catch (error) {
    expect(error.message).toEqual(`subscription ${user.userID} not found`);
  }
  
  await actionTester.done();
});
