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
  SpaceUpdateSubscriptionPayload,
  SpacePayload,
  SpaceUserPayload,
  SpaceTelemetrySubscriptionPayload,
  GET_USER_SPACES,
  SUBSCRIBE_TO_SPACE_UPDATES,
  SPACE_UPDATE,
  SUBSCRIBE_TO_SPACE_TELEMETRY,
  SPACE_TELEMETRY
} from '../../actions';
import {
  UserSpaceState,
  initialUserSpaceState
} from '../../state';
import {
  SpaceUpdate,
  SpaceUserUpdate
} from '../../../model/types';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('get-user-spaces.test');

// test reducer validates action flows
const actionTester = new ActionTester<UserSpaceState>(logger, initialUserSpaceState());
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

const _ = require('lodash');

it('dispatches an action to retrieve the logged in user tom\'s spaces', async () => {

  mockProvider.setLoggedInUser('bob');
  const spaceUsers = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
    .filter(spaceUser => spaceUser!.status == UserAccessStatus.active);
  
  const subSpaceIDs = spaceUsers.map(
    su => su.space!.spaceID
  ).sort();
  const subSpaceUserIDs = spaceUsers
    .filter(su => su.isOwner)
    .flatMap(
      su1 => su1.space!.users!.spaceUsers!.map(
        su2 => su1.space!.spaceID + '|' + su2!.user!.userID
      )
    )
    .concat(
      spaceUsers
        .filter(su => !su.isOwner)
        .map(su => su.space!.spaceID + '|' + su!.user!.userID)
    )
    .sort();

  const testSubSpace1 = spaceUsers[0].space!;
  const testSubSpaceUser1 = testSubSpace1.users!.spaceUsers![0]!;
  const testSubSpace2 = spaceUsers[1].space!;
  const testSubSpaceUser2 = testSubSpace2.users!.spaceUsers![1]!;

  // expected actions to get user spaces and set up 
  // subscribtions to space and space user updates
  actionTester.expectAction(GET_USER_SPACES)
    .success<SpaceUsersPayload>(undefined, 
      (counter, state, action) => { 
        expect(action.payload!).toEqual({spaceUsers});
        return {
          ...state,
          userSpaces: _.cloneDeep(action.payload!.spaceUsers)
        };
      }
    );
  actionTester.expectAction<SpaceUpdateSubscriptionPayload>(
    SUBSCRIBE_TO_SPACE_UPDATES, undefined, 
    (counter, state, action) => {
      expect(
        action.payload!.subscribeSpaces.sort().toString()
      ).toEqual(subSpaceIDs.toString());
      expect(action.payload!.unsubscribeSpaces.toString()).toEqual('');
      return state;
    }
  )
    .success();
  actionTester.expectAction<SpaceTelemetrySubscriptionPayload>(
    SUBSCRIBE_TO_SPACE_TELEMETRY, undefined, 
    (counter, state, action) => {
      expect(
        action.payload!.subscribeSpaceUsers.map(
          ({spaceID, userID}) => spaceID + '|' + userID
        ).sort().toString()
      ).toEqual(subSpaceUserIDs.toString());
      expect(action.payload!.unsubscribeSpaceUsers.toString()).toEqual('');
      return state;
    }
  )
    .success();

  // expected updates subscribed to
  actionTester.expectAction<SpacePayload>(SPACE_UPDATE, { 
    space: { 
      __typename: 'Space',
      publicKey: 'New public key #1'
    }
  });
  actionTester.expectAction<SpacePayload>(SPACE_UPDATE, { 
    space: { 
      __typename: 'Space',
      publicKey: 'New public key #2',
    }
  });
  actionTester.expectAction<SpaceUserPayload>(SPACE_TELEMETRY, { 
    spaceUser: { 
      __typename: 'SpaceUser',
      bytesDownloaded: 10,
      bytesUploaded: 20
    }
  });
  actionTester.expectAction<SpaceUserPayload>(SPACE_TELEMETRY, { 
    spaceUser: { 
      __typename: 'SpaceUser',
      bytesDownloaded: 22,
      bytesUploaded: 11,
    }
  });

  // refresh action expected as space update should 
  // have detected a change to a space's user list
  actionTester.expectAction(GET_USER_SPACES).success({ spaceUsers });
  actionTester.expectAction<SpaceTelemetrySubscriptionPayload>(
    SUBSCRIBE_TO_SPACE_TELEMETRY, undefined, 
    (counter, state, action) => {
      expect(action.payload?.subscribeSpaceUsers).toEqual([]);
      expect(action.payload?.unsubscribeSpaceUsers).toEqual([{
        'spaceID': testSubSpace2.spaceID,
        'userID': testSubSpaceUser2.user!.userID!
      }]);
      return state;
    }
  )
    .success();

  // initiate data retrieval
  dispatch.userspaceService!.getUserSpaces();

  // push updates
  const pushSpaceUpdates = () => {
    try {
      mockProvider.pushSubscriptionUpdate(<SpaceUpdate>{
        spaceID: testSubSpace1.spaceID,
        numUsers: testSubSpace1.users!.spaceUsers!.length,
        space: { 
          __typename: 'Space',
          publicKey: 'New public key #1'
        }
      }, testSubSpace1.spaceID!);  
      mockProvider.pushSubscriptionUpdate(<SpaceUpdate>{
        spaceID: testSubSpace1.spaceID,
        numUsers: testSubSpace1.users!.spaceUsers!.length,
        space: { 
          __typename: 'Space',
          publicKey: 'New public key #2'
        }
      }, testSubSpace1.spaceID!);

      mockProvider.deleteSpaceUser(testSubSpace2.spaceID!, testSubSpaceUser2.user!.userID!);
      mockProvider.pushSubscriptionUpdate(<SpaceUpdate>{
        spaceID: testSubSpace2.spaceID,
        numUsers: testSubSpace2.users!.spaceUsers!.length,
      }, testSubSpace2.spaceID!);

    } catch (error) {
      console.log('waiting for subscription', error.message);
      setTimeout(pushSpaceUpdates, 500);
    }
  }
  setTimeout(pushSpaceUpdates, 500);

  const pushSpaceTelementry = () => {
    try {
      mockProvider.pushSubscriptionUpdate(<SpaceUserUpdate>{
        spaceID: testSubSpaceUser1.space!.spaceID,
        userID: testSubSpaceUser1.user!.userID,
        spaceUser: { 
          __typename: 'SpaceUser',
          bytesDownloaded: 10,
          bytesUploaded: 20
        }
      }, testSubSpaceUser1.space!.spaceID!, testSubSpaceUser1.user!.userID!);
      mockProvider.pushSubscriptionUpdate(<SpaceUserUpdate>{
        spaceID: testSubSpaceUser1.space!.spaceID,
        userID: testSubSpaceUser1.user!.userID,
        spaceUser: { 
          __typename: 'SpaceUser',
          bytesDownloaded: 22,
          bytesUploaded: 11
        }
      }, testSubSpaceUser1.space!.spaceID!, testSubSpaceUser1.user!.userID!);
      
    } catch (error) {
      console.log('waiting for subscription', error.message);
      setTimeout(pushSpaceTelementry, 500);
    }  
  };
  setTimeout(pushSpaceTelementry, 500);

  await actionTester.done();
});
