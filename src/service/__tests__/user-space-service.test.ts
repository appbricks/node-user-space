import * as redux from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import { 
  Logger,
  LOG_LEVEL_TRACE, 
  setLogLevel, 
  reduxLogger, 
  combineEpicsWithGlobalErrorHandler, 
  ActionResult
} from '@appbricks/utils';
import { StateTester } from '@appbricks/test-utils';

import {
  DeviceUser,
  SpaceUser,
  UserAccessStatus
} from '../../model/types';

import {
  UserSpaceActionProps,
  USER_SEARCH,
  CLEAR_USER_SEARCH_RESULTS,
  GET_USER_DEVICES,
  GET_DEVICE_ACCESS_REQUESTS,
  ACTIVATE_USER_ON_DEVICE,
  DELETE_USER_FROM_DEVICE,
  DELETE_USER_FROM_SPACE,
  DELETE_DEVICE,
  GET_USER_DEVICE_TELEMETRY,
  GET_USER_SPACES,
  INVITE_USER_TO_SPACE,
  GRANT_USER_ACCESS_TO_SPACE,
  REMOVE_USER_ACCESS_TO_SPACE,
  DELETE_SPACE,
  GET_USER_SPACE_TELEMETRY,
  GET_SPACE_INVITATIONS,
  ACCEPT_SPACE_INVITATION,
  LEAVE_SPACE,
  GET_USER_APPS,
  GET_APP_INVITATIONS,
  GET_USER_APP_TELEMETRY,
} from '../action';
import { UserSpaceState } from '../state';
import UserSpaceService from '../user-space-service';

import MockProvider from './mock-provider';

if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('auth-service-reducer.test');

// Local store implementation
const localStore: { [key: string]: Object } = {};

const stateTester = new StateTester<UserSpaceState>(logger);
let mockProvider = new MockProvider();

let getState: () => UserSpaceState;

let dispatch: UserSpaceActionProps;

beforeEach(async () => {

  const userspaceService = new UserSpaceService(mockProvider);

  // initialize redux store
  let rootReducer = redux.combineReducers({
    userspace: userspaceService.reducer()
  });

  let epicMiddleware = createEpicMiddleware();
  const store = redux.createStore(
    rootReducer,
    redux.applyMiddleware(reduxLogger, epicMiddleware)
  );

  let rootEpic = combineEpicsWithGlobalErrorHandler(userspaceService.epics());
  epicMiddleware.run(rootEpic);
  
  getState = () => store.getState().userspace;
  store.subscribe(
    stateTester.test(getState)
  );

  dispatch = UserSpaceService.dispatchProps(<redux.Dispatch<redux.Action>>store.dispatch);
})

it('searches a list of users', async () => {
  mockProvider.setLoggedInUser('tom');

  stateTester.expectStateTest(
    USER_SEARCH, ActionResult.pending,
    (counter, state, status) => {
      expect(status.timestamp).toBeGreaterThan(0);
    }
  );
  stateTester.expectStateTest(
    USER_SEARCH, ActionResult.success,
    (counter, state, status) => {
      expect(state.userSearchResult).toEqual({
        result: [
          {
            __typename: 'UserSearchItem',
            userID: '95e579be-a365-4268-bed0-17df80ef3dce',
            userName: 'deb'
          },
          {
            __typename: 'UserSearchItem',
            userID: 'c18d325c-c0f1-4ba3-8898-026b48eb9bdc',
            userName: 'debbie'
          },
          {
            __typename: 'UserSearchItem',
            userID: 'e745d48e-d9ba-4277-9d9e-fc13197eff38',
            userName: 'denny'
          },
          {
            __typename: 'UserSearchItem',
            userID: '1ade82fc-750e-433c-aa30-4c5764ff02fb',
            userName: 'darren'
          },
          {
            __typename: 'UserSearchItem',
            userID: '8e0a1535-bf9e-4548-8602-ce3b0f619734',
            userName: 'danny'
          }
        ],
        searchPrefix: 'd',
        limit: undefined,
        pageInfo: {
          __typename: 'PageInfo',
          hasPreviousePage: false,
          hasNextPage: false,
          cursor: { __typename: 'Cursor', index: -1, nextTokens: [] }
        }
      });
    }
  );
  dispatch.userspaceService!.userSearch('d');
  await stateTester.done();

  stateTester.expectState(3);
  dispatch.userspaceService!.clearUserSearchResults();
  await stateTester.done();

  expect(getState().userSearchResult).toBeUndefined();
});

it('retrieves a users list of devices', async () => {
  mockProvider.setLoggedInUser('tom');

  stateTester.expectStateTest(GET_USER_DEVICES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_DEVICES, ActionResult.success,
    (counter, state, status) => {
      const userDevices = <DeviceUser[]>mockProvider.user!.devices!.deviceUsers!
        .filter(deviceUser => deviceUser!.status == UserAccessStatus.active);
  
      expect(state.userDevices).toEqual(userDevices);
    }
  );
  dispatch.userspaceService!.getUserDevices();
  await stateTester.done();
});

it('retrieves a access requests for a user\'s device and accepts a request', async () => {
  mockProvider.setLoggedInUser('tom');

  const deviceID = 'ed3e2219-ff72-4405-88fb-8dab24030770';
  stateTester.expectStateTest(GET_DEVICE_ACCESS_REQUESTS, ActionResult.pending);
  stateTester.expectStateTest(
    GET_DEVICE_ACCESS_REQUESTS, ActionResult.success,
    (counter, state, status) => {
      const deviceUsers = <DeviceUser[]>mockProvider.user!.devices!.deviceUsers!
        .filter(deviceUser => deviceUser!.isOwner)
        .map(deviceUser => deviceUser!.device)
        .reduce( 
          (accessRequests, device) => accessRequests.concat(
            device!.users!.deviceUsers!.filter(
              deviceUser => 
                deviceUser!.status == UserAccessStatus.pending &&
                deviceUser!.device!.deviceID == deviceID
            )
          ),
          <(DeviceUser | null)[]>[]
        );

      expect(state.deviceAccessRequests![deviceID].length).toEqual(1);
      expect(state.deviceAccessRequests![deviceID]).toEqual(deviceUsers);
    }
  );
  dispatch.userspaceService!.getDeviceAccessRequests(deviceID);
  await stateTester.done();

  const deviceUserToActOn = getState().deviceAccessRequests![deviceID][0];
  stateTester.expectStateTest(ACTIVATE_USER_ON_DEVICE, ActionResult.pending);
  stateTester.expectStateTest(ACTIVATE_USER_ON_DEVICE, ActionResult.success);
  stateTester.expectStateTest(GET_DEVICE_ACCESS_REQUESTS, ActionResult.pending);
  stateTester.expectStateTest(GET_USER_DEVICES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_DEVICE_ACCESS_REQUESTS, ActionResult.success,
    (counter, state, status) => {
      expect(state.deviceAccessRequests![deviceID].length).toEqual(0);
    }
  );
  stateTester.expectStateTest(
    GET_USER_DEVICES, ActionResult.success,
    (counter, state, status) => {
      const deviceUser = state.userDevices!
        .find(deviceUser => deviceUser!.device!.deviceID == deviceID)!.device!.users!.deviceUsers!
        .find(deviceUser => deviceUser!.user!.userID == deviceUserToActOn.user!.userID);

      expect(deviceUser!.status).toEqual(UserAccessStatus.active);
    }
  );
  dispatch.userspaceService!.activateUserOnDevice(deviceID, deviceUserToActOn.user!.userID!);
  await stateTester.done();

  stateTester.expectStateTest(DELETE_USER_FROM_DEVICE, ActionResult.pending);
  stateTester.expectStateTest(DELETE_USER_FROM_DEVICE, ActionResult.success);
  stateTester.expectStateTest(GET_DEVICE_ACCESS_REQUESTS, ActionResult.pending);
  stateTester.expectStateTest(GET_USER_DEVICES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_DEVICE_ACCESS_REQUESTS, ActionResult.success,
    (counter, state, status) => {
      expect(state.deviceAccessRequests![deviceID].length).toEqual(0);
    }
  );
  stateTester.expectStateTest(
    GET_USER_DEVICES, ActionResult.success,
    (counter, state, status) => {
      const deviceUser = state.userDevices!
        .find(deviceUser => deviceUser!.device!.deviceID == deviceID)!.device!.users!.deviceUsers!
        .find(deviceUser => deviceUser!.user!.userID == deviceUserToActOn.user!.userID);

      expect(deviceUser).toBeUndefined();
    }
  );
  dispatch.userspaceService!.deleteUserFromDevice(deviceID, deviceUserToActOn.user!.userID!);
  await stateTester.done();

  stateTester.expectStateTest(DELETE_DEVICE, ActionResult.pending);
  stateTester.expectStateTest(DELETE_DEVICE, ActionResult.success);
  stateTester.expectStateTest(GET_USER_DEVICES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_DEVICES, ActionResult.success,
    (counter, state, status) => {
      const deviceUser = state.userDevices!
        .find(deviceUser => deviceUser!.device!.deviceID == deviceID);

      expect(deviceUser).toBeUndefined();
    }
  );
  dispatch.userspaceService!.deleteDevice(deviceID);
  await stateTester.done();
});

it('retrieves a users list of spaces', async () => {
  mockProvider.setLoggedInUser('tom');

  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_SPACES, ActionResult.success,
    (counter, state, status) => {
      const userSpaces = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
        .filter(spaceUser => spaceUser!.status == UserAccessStatus.active);

      expect(state.userSpaces).toEqual(userSpaces);
      expect(state.spaceUsers).toEqual(
        {
          'd83b7d95-5681-427d-a65a-5d8a868d72e9': [
            {
              userID: 'd12935f9-55b3-4514-8346-baaf99d6e6fa',
              userName: 'bob',
              fullName: '',
              status: 'pending',
              bytesUploaded: '0 bytes',
              bytesDownloaded: '0 bytes',
              lastConnectTime: 'never'
            },
            {
              userID: '95e579be-a365-4268-bed0-17df80ef3dce',
              userName: 'deb',
              fullName: '',
              status: 'active',
              bytesUploaded: '3.2 MiB',
              bytesDownloaded: '4.6 MiB',
              lastConnectTime: '5/19/2021 16:53:18 EDT'
            }
          ]
        }
      );
    }
  );
  dispatch.userspaceService!.getUserSpaces();
  await stateTester.done();
});

it('retrieves space invitations for user, accepts an invitation and leaves a space', async () => {
  mockProvider.setLoggedInUser('tom');

  stateTester.expectStateTest(GET_SPACE_INVITATIONS, ActionResult.pending);
  stateTester.expectStateTest(
    GET_SPACE_INVITATIONS, ActionResult.success,
    (counter, state, status) => {
      const spaceInvitations = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
        .filter(spaceUser => spaceUser!.status == UserAccessStatus.pending);
  
      expect(state.spaceInvitations).toEqual(spaceInvitations);
    }
  );
  dispatch.userspaceService!.getSpaceInvitations();
  await stateTester.done();

  let spaceInvitation = getState().spaceInvitations![0];
  stateTester.expectStateTest(ACCEPT_SPACE_INVITATION, ActionResult.pending);
  stateTester.expectStateTest(ACCEPT_SPACE_INVITATION, ActionResult.success);
  stateTester.expectStateTest(GET_SPACE_INVITATIONS, ActionResult.pending);
  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_SPACE_INVITATIONS, ActionResult.success,
    (counter, state, status) => {
      const spaceInvitations = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
        .filter(spaceUser => spaceUser!.status == UserAccessStatus.pending);
  
      expect(state.spaceInvitations!.length).toEqual(0);
    }
  );
  stateTester.expectStateTest(
    GET_USER_SPACES, ActionResult.success,
    (counter, state, status) => {
      const userSpaces = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
        .filter(spaceUser => spaceUser!.status == UserAccessStatus.active);
      const spaceJoined = userSpaces
        .find(spaceUser => spaceUser!.space!.spaceID == spaceInvitation.space!.spaceID);
      
      expect(userSpaces.length).toEqual(3);
      expect(spaceJoined).toBeTruthy();
      expect(spaceJoined!.status).toEqual(UserAccessStatus.active);
    }
  );
  dispatch.userspaceService!.acceptSpaceInvitation(spaceInvitation.space!.spaceID!);
  await stateTester.done();

  stateTester.expectStateTest(LEAVE_SPACE, ActionResult.pending);
  stateTester.expectStateTest(LEAVE_SPACE, ActionResult.success);
  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_SPACES, ActionResult.success,
    (counter, state, status) => {
      const userSpaces = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
        .filter(spaceUser => spaceUser!.status == UserAccessStatus.active);
      const spaceLeft = <SpaceUser>mockProvider.user!.spaces!.spaceUsers!
        .find(spaceUser => spaceUser!.space!.spaceID == spaceInvitation.space!.spaceID);
  
      expect(userSpaces.length).toEqual(2);
      expect(spaceLeft).toBeTruthy();
      expect(spaceLeft!.status).toEqual(UserAccessStatus.inactive);
    }
  );
  dispatch.userspaceService!.leaveSpace(spaceInvitation.space!.spaceID!);
  await stateTester.done();
});

it('removes a user\'s access to a space and then restores that user\'s access', async () => {
  mockProvider.setLoggedInUser('tom');

  const spaceID = 'd83b7d95-5681-427d-a65a-5d8a868d72e9'; // tom's space #1
  const userID = '95e579be-a365-4268-bed0-17df80ef3dce'; // deb

  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_SPACES, ActionResult.success,
    (counter, state, status) => {
      const debsSpaceAccess = state.userSpaces!
        .find(userSpace => userSpace.space!.spaceID == spaceID)!.space!.users!.spaceUsers!
        .find(userSpace => userSpace!.user!.userID == userID)
      
      expect(debsSpaceAccess).toBeTruthy();
    }
  );
  dispatch.userspaceService!.getUserSpaces();
  await stateTester.done();

  stateTester.expectStateTest(REMOVE_USER_ACCESS_TO_SPACE, ActionResult.pending);
  stateTester.expectStateTest(REMOVE_USER_ACCESS_TO_SPACE, ActionResult.success);
  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_SPACES, ActionResult.success,
    (counter, state, status) => {
      const debsSpaceAccess = state.userSpaces!
        .find(userSpace => userSpace.space!.spaceID == spaceID)!.space!.users!.spaceUsers!
        .find(userSpace => userSpace!.user!.userID == userID)
      
      expect(debsSpaceAccess).toBeTruthy();
      expect(debsSpaceAccess!.status).toEqual(UserAccessStatus.inactive);
    }
  );
  dispatch.userspaceService!.removeUserAccessToSpace(spaceID, userID);
  await stateTester.done();

  stateTester.expectStateTest(GRANT_USER_ACCESS_TO_SPACE, ActionResult.pending);
  stateTester.expectStateTest(GRANT_USER_ACCESS_TO_SPACE, ActionResult.success);
  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_SPACES, ActionResult.success,
    (counter, state, status) => {
      const debsSpaceAccess = state.userSpaces!
        .find(userSpace => userSpace.space!.spaceID == spaceID)!.space!.users!.spaceUsers!
        .find(userSpace => userSpace!.user!.userID == userID)
      
      expect(debsSpaceAccess).toBeTruthy();
      expect(debsSpaceAccess!.status).toEqual(UserAccessStatus.active);
    }
  );
  dispatch.userspaceService!.grantUserAccessToSpace(spaceID, userID);
  await stateTester.done();
});

it('deletes a user from a space', async () => {
  mockProvider.setLoggedInUser('tom');

  const spaceID = 'd83b7d95-5681-427d-a65a-5d8a868d72e9'; // tom's space #1
  const userID = '95e579be-a365-4268-bed0-17df80ef3dce'; // deb

  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_SPACES, ActionResult.success,
    (counter, state, status) => {
      const debsSpaceAccess = state.userSpaces!
        .find(userSpace => userSpace.space!.spaceID == spaceID)!.space!.users!.spaceUsers!
        .find(userSpace => userSpace!.user!.userID == userID)
      
      expect(debsSpaceAccess).toBeTruthy();
    }
  );
  dispatch.userspaceService!.getUserSpaces();
  await stateTester.done();

  stateTester.expectStateTest(DELETE_USER_FROM_SPACE, ActionResult.pending);
  stateTester.expectStateTest(DELETE_USER_FROM_SPACE, ActionResult.success);
  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_SPACES, ActionResult.success,
    (counter, state, status) => {
      const debsSpaceAccess = state.userSpaces!
        .find(userSpace => userSpace.space!.spaceID == spaceID)!.space!.users!.spaceUsers!
        .find(userSpace => userSpace!.user!.userID == userID)
      
      expect(debsSpaceAccess).toBeFalsy();
    }
  );
  dispatch.userspaceService!.deleteUserFromSpace(spaceID, userID);
  await stateTester.done();  
});

it('deletes a space', async () => {
  mockProvider.setLoggedInUser('tom');

  const spaceID = 'd83b7d95-5681-427d-a65a-5d8a868d72e9'; // tom's space #1

  stateTester.expectStateTest(DELETE_SPACE, ActionResult.pending);
  stateTester.expectStateTest(DELETE_SPACE, ActionResult.success);
  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_SPACES, ActionResult.success,
    (counter, state, status) => {
      const spaceExists = state.userSpaces!
        .find(userSpace => userSpace.space!.spaceID == spaceID);
      
      expect(spaceExists).toBeFalsy();
    }
  );
  dispatch.userspaceService!.deleteSpace(spaceID);
  await stateTester.done();
});