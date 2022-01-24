import * as redux from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import { 
  Logger,
  LOG_LEVEL_TRACE, 
  setLogLevel, 
  reduxLogger, 
  combineEpicsWithGlobalErrorHandler, 
  ActionResult,
  dateTimeToLocale
} from '@appbricks/utils';
import { StateTester } from '@appbricks/test-utils';

import {
  DeviceUser,
  SpaceUser,
  UserAccessStatus,
  DeviceUpdate,
  DeviceUserUpdate,
  SpaceUpdate,
  SpaceUserUpdate
} from '../../model/types';
import { 
  DeviceDetail,
  DeviceUserListItem,
  SpaceDetail,
  SpaceUserListItem
} from '../../model/display';

import {
  UserSpaceActionProps,
  USER_SEARCH,
  CLEAR_USER_SEARCH_RESULTS,
  GET_USER_DEVICES,
  SUBSCRIBE_TO_DEVICE_UPDATES,
  DEVICE_UPDATE,
  SUBSCRIBE_TO_DEVICE_TELEMETRY,
  DEVICE_TELEMETRY,
  GET_DEVICE_ACCESS_REQUESTS,
  ACTIVATE_USER_ON_DEVICE,
  DELETE_USER_FROM_DEVICE,
  DELETE_USER_FROM_SPACE,
  DELETE_DEVICE,
  GET_USER_SPACES,
  SUBSCRIBE_TO_SPACE_UPDATES,
  SUBSCRIBE_TO_SPACE_TELEMETRY,
  INVITE_USER_TO_SPACE,
  GRANT_USER_ACCESS_TO_SPACE,
  REMOVE_USER_ACCESS_TO_SPACE,
  DELETE_SPACE,
  GET_SPACE_INVITATIONS,
  ACCEPT_SPACE_INVITATION,
  LEAVE_SPACE,
  GET_USER_APPS,
  GET_APP_INVITATIONS,
} from '../actions';
import { UserSpaceState } from '../state';
import UserSpaceService from '../user-space-service';

import MockProvider, {
  date1,
  date2,
  date3
} from './mock-provider';

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

beforeAll(async () => {

  const userspaceService = new UserSpaceService(mockProvider);

  // initialize redux store
  let rootReducer = redux.combineReducers({
    userspace: userspaceService.reducer()
  });

  let epicMiddleware = createEpicMiddleware();
  const store = redux.createStore(
    rootReducer,
    redux.applyMiddleware(reduxLogger, <any>epicMiddleware)
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
      expect(state.userSearchResult).toEqual([
        {
          __typename: 'UserRef',
          userID: '95e579be-a365-4268-bed0-17df80ef3dce',
          userName: 'deb',
          firstName: 'Deborah',
          middleName: 'Plynk',
          familyName: 'Sanders'
        },
        {
          __typename: 'UserRef',
          userID: 'c18d325c-c0f1-4ba3-8898-026b48eb9bdc',
          userName: 'debbie'
        },
        {
          __typename: 'UserRef',
          userID: 'e745d48e-d9ba-4277-9d9e-fc13197eff38',
          userName: 'denny'
        },
        {
          __typename: 'UserRef',
          userID: '1ade82fc-750e-433c-aa30-4c5764ff02fb',
          userName: 'darren'
        },
        {
          __typename: 'UserRef',
          userID: '8e0a1535-bf9e-4548-8602-ce3b0f619734',
          userName: 'danny'
        }
      ]);
    }
  );
  dispatch.userspaceService!.userSearch('d');
  await stateTester.done();

  stateTester.expectState(1);
  dispatch.userspaceService!.clearUserSearchResults();
  await stateTester.done();

  expect(getState().userSearchResult).toBeUndefined();
});

it('retrieves a user\'s list of devices', async () => {
  mockProvider.setLoggedInUser('tom');

  stateTester.expectStateTest(GET_USER_DEVICES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_DEVICES, ActionResult.success,
    (counter, state, status) => {
      const userDevices = <DeviceUser[]>mockProvider.user!.devices!.deviceUsers!
        .filter(deviceUser => deviceUser!.status == UserAccessStatus.active);
  
      expect(state.userDevices).toEqual(userDevices);
      expect(state.devices).toMatchObject(devicesDetail);
    }
  );
  stateTester.expectStateTest(SUBSCRIBE_TO_DEVICE_UPDATES, ActionResult.pending);
  stateTester.expectStateTest(SUBSCRIBE_TO_DEVICE_TELEMETRY, ActionResult.pending);
  stateTester.expectStateTest(SUBSCRIBE_TO_DEVICE_UPDATES, ActionResult.success);
  stateTester.expectStateTest(SUBSCRIBE_TO_DEVICE_TELEMETRY, ActionResult.success);
  dispatch.userspaceService!.getUserDevices();
  await stateTester.done();

  // send device update
  stateTester.expectState(1, undefined,
    (counter, state, status) => {

      // update expected value and compare with actual
      const deviceDetail = devicesDetail["f25b8176-dbb7-4a8a-b08d-5f8e56cc4303"]
      const deviceInfoUpdated = {
        ...deviceDetail,
        name: "bob's device #1 updated",
        type: "UbuntuDesktop",
        version: "cli/linux:amd64/1.5.5",
        updatedFields: [ "name", "type", "version" ], 
      }
      devicesDetail["f25b8176-dbb7-4a8a-b08d-5f8e56cc4303"] = deviceInfoUpdated;

      logger.trace('state.devices after device update', JSON.stringify(state.devices, skipRefs, 2));
      expect(state.devices).toMatchObject(devicesDetail);
    }
  )
  mockProvider.pushSubscriptionUpdate(<DeviceUpdate>{
    __typename: "DeviceUpdate",
    deviceID: "f25b8176-dbb7-4a8a-b08d-5f8e56cc4303",
    numUsers: 3,
    device: {
      __typename: "Device",
      deviceName: "bob's device #1 updated",
      deviceType: "UbuntuDesktop",
      clientVersion: "cli/linux:amd64/1.5.5"
    }
  }, "f25b8176-dbb7-4a8a-b08d-5f8e56cc4303");
  await stateTester.done();

  // send device telemetry
  let updateTime = Date.now();
  stateTester.expectState(1, undefined,
    (counter, state, status) => {

      // update expected value and compare with actual
      const detail = devicesDetail["f25b8176-dbb7-4a8a-b08d-5f8e56cc4303"]
      const detailUpdated = {
        ...detail,
        lastAccessed: dateTimeToLocale(new Date(updateTime), true),
        lastSpaceConnectedTo: "bob's space #1",
        dataUsageIn: "1.8 KiB",
        dataUsageOut: "1.6 KiB",
        bytesDownloaded: 1813,
        bytesUploaded: 1655,
        lastAccessedTime: updateTime,
        updatedFields: [
          "lastAccessed",
          "lastSpaceConnectedTo",
          "dataUsageIn",
          "dataUsageOut",
          "bytesDownloaded",
          "bytesUploaded",
          "lastAccessedTime",
        ]
      }
      const itemUpdated = {
        ...detailUpdated.users.find((item, i, users) => {
          if (item.userID == "a645c56e-f454-460f-8324-eff15357e973") {
            users.splice(i, 1);
            return true;
          }
          return false;
        }),
        lastSpaceConnectedTo: "bob's space #1",
        dataUsageIn: "1.3 KiB",
        dataUsageOut: "832 bytes",
        lastAccessTime: dateTimeToLocale(new Date(updateTime), true)
      };
      detailUpdated.users.unshift(<DeviceUserListItem>itemUpdated);
      devicesDetail["f25b8176-dbb7-4a8a-b08d-5f8e56cc4303"] = <DeviceDetail>detailUpdated;

      logger.trace('state.devices after telemetry update', JSON.stringify(state.devices, skipRefs, 2));
      expect(state.devices).toMatchObject(devicesDetail);
    }
  )
  mockProvider.pushSubscriptionUpdate(<DeviceUserUpdate>{
    deviceID: "f25b8176-dbb7-4a8a-b08d-5f8e56cc4303",
    userID: "a645c56e-f454-460f-8324-eff15357e973",
    deviceUser: {
      bytesDownloaded: 1348,
      bytesUploaded: 832,
      lastAccessTime: updateTime,
      lastSpaceConnectedTo: "bob's space #1"
    }
  }, "f25b8176-dbb7-4a8a-b08d-5f8e56cc4303", "a645c56e-f454-460f-8324-eff15357e973");
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
  stateTester.expectStateTest(GET_USER_DEVICES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_DEVICES, ActionResult.success,
    (counter, state, status) => {
      const deviceUser = state.userDevices!
        .find(deviceUser => deviceUser!.device!.deviceID == deviceID)!.device!.users!.deviceUsers!
        .find(deviceUser => deviceUser!.user!.userID == deviceUserToActOn.user!.userID);

      expect(deviceUser!.status).toEqual(UserAccessStatus.active);
    }
  );
  stateTester.expectState(2); // skip GET_USER_DEVICES subscription NOOP side-effects
  dispatch.userspaceService!.activateUserOnDevice(deviceID, deviceUserToActOn.user!.userID!);
  await stateTester.done();

  stateTester.expectStateTest(DELETE_USER_FROM_DEVICE, ActionResult.pending);
  stateTester.expectStateTest(DELETE_USER_FROM_DEVICE, ActionResult.success);
  stateTester.expectStateTest(GET_USER_DEVICES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_DEVICES, ActionResult.success,
    (counter, state, status) => {
      const deviceUser = state.userDevices!
        .find(deviceUser => deviceUser!.device!.deviceID == deviceID)!.device!.users!.deviceUsers!
        .find(deviceUser => deviceUser!.user!.userID == deviceUserToActOn.user!.userID);

      expect(deviceUser).toBeUndefined();
    }
  );
  stateTester.expectState(2); // skip GET_USER_DEVICES subscription NOOP side-effects
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
  stateTester.expectState(4); // skip GET_USER_DEVICES subscription side-effects
  dispatch.userspaceService!.deleteDevice(deviceID);
  await stateTester.done();
});

it('retrieves a user\'s list of spaces', async () => {
  mockProvider.setLoggedInUser('tom');

  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_SPACES, ActionResult.success,
    (counter, state, status) => {
      const userSpaces = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
        .filter(spaceUser => spaceUser!.status == UserAccessStatus.active);

      expect(state.userSpaces).toEqual(userSpaces);
      expect(state.spaces).toMatchObject(spacesDetail);
    }
  );
  stateTester.expectStateTest(SUBSCRIBE_TO_SPACE_UPDATES, ActionResult.pending);
  stateTester.expectStateTest(SUBSCRIBE_TO_SPACE_TELEMETRY, ActionResult.pending);
  stateTester.expectStateTest(SUBSCRIBE_TO_SPACE_UPDATES, ActionResult.success);
  stateTester.expectStateTest(SUBSCRIBE_TO_SPACE_TELEMETRY, ActionResult.success);
  dispatch.userspaceService!.getUserSpaces();
  await stateTester.done();

  // send space update
  stateTester.expectState(1, undefined,
    (counter, state, status) => {

      // update expected value and compare with actual
      const spaceDetail = spacesDetail["d83b7d95-5681-427d-a65a-5d8a868d72e9"]
      const spaceInfoUpdated = {
        ...spaceDetail,
        name: "tom's space #1 updated",
        status: "shutdown",
        version: "2.0.1",
        updatedFields: [ "name", "status", "version" ], 
      }
      spacesDetail["d83b7d95-5681-427d-a65a-5d8a868d72e9"] = spaceInfoUpdated;

      logger.trace('state.space after device update', JSON.stringify(state.spaces, skipRefs, 2));
      expect(state.spaces).toMatchObject(spacesDetail);
    }
  )
  mockProvider.pushSubscriptionUpdate(<SpaceUpdate>{
    __typename: "SpaceUpdate",
    spaceID: "d83b7d95-5681-427d-a65a-5d8a868d72e9",
    numUsers: 3,
    space: {
      __typename: "Space",
      spaceName: "tom's space #1 updated",
      status: "shutdown",
      version: "2.0.1"
    }
  }, "d83b7d95-5681-427d-a65a-5d8a868d72e9");
  await stateTester.done();

  // send space telemetry
  let updateTime = Date.now();
  stateTester.expectState(1, undefined,
    (counter, state, status) => {

      // update expected value and compare with actual
      const detail = spacesDetail["9a5242dc-0681-4d67-9fe7-bdc691d1a18d"]
      const detailUpdated = {
        ...detail,
        dataUsageIn: "2.6 MiB",
        dataUsageOut: "8.3 MiB",
        bytesDownloaded: 2762977,
        bytesUploaded: 8663340,
        updatedFields: [
          "dataUsageIn",
          "dataUsageOut",
          "bytesDownloaded",
          "bytesUploaded",
        ]
      }
      const itemUpdated = {
        ...detailUpdated.users.find((item, i, users) => {
          if (item.userID == "95e579be-a365-4268-bed0-17df80ef3dce") {
            users.splice(i, 1);
            return true;
          }
          return false;
        }),
        status: "active",
        dataUsageIn: "364.9 KiB",
        dataUsageOut: "413.5 KiB",
        lastConnectTime: dateTimeToLocale(new Date(updateTime), true),
        "updatedFields": [
          "status",
          "dataUsageIn",
          "dataUsageOut",
          "lastConnectTime"
        ]
      };
      detailUpdated.users.unshift(<SpaceUserListItem>itemUpdated);
      spacesDetail["9a5242dc-0681-4d67-9fe7-bdc691d1a18d"] = <SpaceDetail>detailUpdated;

      logger.trace('state.spaces after telemetry update', JSON.stringify(state.spaces, skipRefs(), 2));
      expect(state.spaces).toMatchObject(spacesDetail);
    }
  )
  mockProvider.pushSubscriptionUpdate(<SpaceUserUpdate>{
    spaceID: "9a5242dc-0681-4d67-9fe7-bdc691d1a18d",
    userID: "95e579be-a365-4268-bed0-17df80ef3dce",
    spaceUser: {
      status: "active",
      bytesDownloaded: 373634,
      bytesUploaded: 423456,
      lastConnectTime: updateTime,
    }
  }, "9a5242dc-0681-4d67-9fe7-bdc691d1a18d", "95e579be-a365-4268-bed0-17df80ef3dce");
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
  stateTester.expectStateTest(
    GET_SPACE_INVITATIONS, ActionResult.success,
    (counter, state, status) => {
      const spaceInvitations = <SpaceUser[]>mockProvider.user!.spaces!.spaceUsers!
        .filter(spaceUser => spaceUser!.status == UserAccessStatus.pending);
  
      expect(state.spaceInvitations!.length).toEqual(0);
    }
  );
  stateTester.expectStateTest(GET_USER_SPACES, ActionResult.pending);
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
  stateTester.expectState(4); // skip GET_USER_DEVICES subscription side-effects
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
  stateTester.expectState(4); // skip GET_USER_DEVICES subscription side-effects
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
  stateTester.expectState(2); // skip GET_USER_DEVICES subscription NOOP side-effects
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
  stateTester.expectState(2); // skip GET_USER_DEVICES subscription NOOP side-effects
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
  stateTester.expectState(2); // skip GET_USER_DEVICES subscription NOOP side-effects
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
  stateTester.expectState(2); // skip GET_USER_DEVICES subscription NOOP side-effects
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
  stateTester.expectState(2); // skip GET_USER_DEVICES subscription NOOP side-effects
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
  stateTester.expectState(4); // skip GET_USER_DEVICES subscription side-effects
  dispatch.userspaceService!.deleteSpace(spaceID);
  await stateTester.done();
});

const devicesDetail: { [deviceID: string]: DeviceDetail } = {
  "c5021ecb-7c69-4950-a53c-fd4d5ca73b6f": {
    name: "tom's device #1",
    type: "MacBook",
    version: "app/darwin:arm64/1.5.0",
    ownerAdmin: "Thomas T. Bradford",
    lastAccessed: dateTimeToLocale(date3, true),
    lastAccessedBy: "Thomas T. Bradford",
    lastSpaceConnectedTo: "bob's space #2",
    dataUsageIn: "21 bytes",
    dataUsageOut: "12 bytes",
    bytesDownloaded: 21,
    bytesUploaded: 12,
    lastAccessedTime: date3.getTime(),
    users: [
      {
        userID: "95e579be-a365-4268-bed0-17df80ef3dce",
        userName: "deb",
        fullName: "Deborah Plynk Sanders",
        status: "pending",
        dataUsageIn: "0 bytes",
        dataUsageOut: "0 bytes",
        lastAccessTime: "never"
      }
    ]
  },
  "ed3e2219-ff72-4405-88fb-8dab24030770": {
    name: "tom's device #2",
    type: "iPhone",
    version: "client/ios:arm64/1.1.0",
    ownerAdmin: "Thomas T. Bradford",
    lastAccessed: dateTimeToLocale(date3, true),
    lastAccessedBy: "Deborah Plynk Sanders",
    lastSpaceConnectedTo: "bob's space #2",
    dataUsageIn: "65 bytes",
    dataUsageOut: "56 bytes",
    bytesDownloaded: 65,
    bytesUploaded: 56,
    lastAccessedTime: date3.getTime(),
    users: [
      {
        userID: "d12935f9-55b3-4514-8346-baaf99d6e6fa",
        userName: "bob",
        fullName: "Bobby J. Brown",
        status: "pending",
        dataUsageIn: "0 bytes",
        dataUsageOut: "0 bytes",
        lastAccessTime: "never"
      },
      {
        userID: "95e579be-a365-4268-bed0-17df80ef3dce",
        userName: "deb",
        fullName: "Deborah Plynk Sanders",
        status: "active",
        dataUsageIn: "65 bytes",
        dataUsageOut: "56 bytes",
        lastAccessTime: dateTimeToLocale(date3),
        lastSpaceConnectedTo: "bob's space #2"
      }
    ]
  },
  "f25b8176-dbb7-4a8a-b08d-5f8e56cc4303": {
    name: "bob's device #1",
    type: "UbuntuServer",
    version: "cli/linux:amd64/1.5.0",
    ownerAdmin: "Bobby J. Brown",
    lastAccessed: dateTimeToLocale(date3, true),
    lastAccessedBy: "Thomas T. Bradford",
    lastSpaceConnectedTo: "bob's space #2",
    dataUsageIn: "1.3 KiB",
    dataUsageOut: "1.4 KiB",
    bytesDownloaded: 1301,
    bytesUploaded: 1406,
    lastAccessedTime: date3.getTime(),
    users: [
      {
        userID: "a645c56e-f454-460f-8324-eff15357e973",
        userName: "tom",
        fullName: "Thomas T. Bradford",
        status: "active",
        dataUsageIn: "836 bytes",
        dataUsageOut: "583 bytes",
        lastAccessTime: dateTimeToLocale(date3),
        lastSpaceConnectedTo: "bob's space #2"
      },
      {
        userID: "95e579be-a365-4268-bed0-17df80ef3dce",
        userName: "deb",
        fullName: "Deborah Plynk Sanders",
        status: "pending",
        lastSpaceConnectedTo: undefined,
        dataUsageIn: "0 bytes",
        dataUsageOut: "0 bytes",
        lastAccessTime: "never"
      }
    ]
  }
};

const spacesDetail: { [spaceID: string]: SpaceDetail } = {
  "d83b7d95-5681-427d-a65a-5d8a868d72e9": {
    name: "tom's space #1",
    status: "running",
    ownerAdmin: "Thomas T. Bradford",
    clientsConnected: 2,
    dataUsageIn: "5.0 MiB",
    dataUsageOut: "12.6 MiB",
    cloudProvider: "aws",
    type: "recipe #1",
    location: "us-east-1",
    version: "2.0.0",
    bytesDownloaded: 5245122,
    bytesUploaded: 13221771,
    users: [
      {
        userID: "d12935f9-55b3-4514-8346-baaf99d6e6fa",
        userName: "bob",
        fullName: "Bobby J. Brown",
        status: "pending",
        dataUsageIn: "0 bytes",
        dataUsageOut: "0 bytes",
        lastConnectTime: "never"
      },
      {
        userID: "95e579be-a365-4268-bed0-17df80ef3dce",
        userName: "deb",
        fullName: "Deborah Plynk Sanders",
        status: "active",
        dataUsageIn: "4.6 MiB",
        dataUsageOut: "3.2 MiB",
        lastConnectTime: dateTimeToLocale(date2)
      }
    ]
  },
  "9a5242dc-0681-4d67-9fe7-bdc691d1a18d": {
    name: "bob's space #2",
    status: "running",
    ownerAdmin: "Bobby J. Brown",
    clientsConnected: 1,
    dataUsageIn: "2.3 MiB",
    dataUsageOut: "7.9 MiB",
    cloudProvider: "gcp",
    type: "recipe #2",
    location: "us-east1",
    version: "1.2.0",
    bytesDownloaded: 2389343,
    bytesUploaded: 8239884,
    users: [
      {
        userID: "a645c56e-f454-460f-8324-eff15357e973",
        userName: "tom",
        fullName: "Thomas T. Bradford",
        status: "active",
        dataUsageIn: "2.3 MiB",
        dataUsageOut: "7.9 MiB",
        lastConnectTime: dateTimeToLocale(date3)
      },
      {
        userID: "95e579be-a365-4268-bed0-17df80ef3dce",
        userName: "deb",
        fullName: "Deborah Plynk Sanders",
        status: "pending",
        dataUsageIn: "0 bytes",
        dataUsageOut: "0 bytes",
        lastConnectTime: "never"
      }
    ]
  }
};

// remove circular reference when stringifying 
// the device/space detail lists
const skipRefs = () => {
  return (key: any, value: any) => {
    if (key == 'deviceUser' || key == 'spaceUser') {
      return;
    }
    return value;
  };
};