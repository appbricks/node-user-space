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
  UserAccessStatus,
  DeviceUser,
  DeviceUpdate,
  DeviceUserUpdate,
  SpaceStatus,
  SpaceUpdate,
  SpaceUser,
  SpaceUserUpdate,
  AppUser,
  AppStatus,
  AppUpdate,
  AppUserUpdate
} from '../../model/types';
import { 
  DeviceDetail,
  SpaceDetail,
  AppDetail
} from '../../model/display';

import {
  UserSpaceActionProps,
  USER_SEARCH,
  GET_USER_DEVICES,
  SUBSCRIBE_TO_DEVICE_UPDATES,
  SUBSCRIBE_TO_DEVICE_TELEMETRY,
  GET_DEVICE_ACCESS_REQUESTS,
  ACTIVATE_USER_ON_DEVICE,
  DELETE_USER_FROM_DEVICE,
  DELETE_USER_FROM_SPACE,
  DELETE_DEVICE,
  GET_USER_SPACES,
  SUBSCRIBE_TO_SPACE_UPDATES,
  SUBSCRIBE_TO_SPACE_TELEMETRY,
  GRANT_USER_ACCESS_TO_SPACE,
  REMOVE_USER_ACCESS_TO_SPACE,
  DELETE_SPACE,
  GET_SPACE_INVITATIONS,
  ACCEPT_SPACE_INVITATION,
  LEAVE_SPACE,
  GET_USER_APPS,
  SUBSCRIBE_TO_APP_UPDATES,
  SUBSCRIBE_TO_APP_TELEMETRY
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

it('retrieves a users list of devices', async () => {
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
        version: "cli/linux:amd64/1.5.5"
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
      const detail = devicesDetail["ed3e2219-ff72-4405-88fb-8dab24030770"]
      const detailUpdated = {
        ...detail,
        lastAccessed: dateTimeToLocale(new Date(updateTime), false),
        lastSpaceConnectedTo: "bob's space #1",
        dataUsageIn: "1.3 KiB",
        dataUsageOut: "832 bytes",
        bytesDownloaded: 1348,
        bytesUploaded: 832,
        lastAccessedTime: updateTime,
      }
      detailUpdated.users.find((item, i, users) => {
        if (item.userID == "95e579be-a365-4268-bed0-17df80ef3dce") {
          item.lastSpaceConnectedTo = "bob's space #1";
          item.dataUsageIn = "1.3 KiB";
          item.dataUsageOut = "832 bytes";
          item.lastAccessTime = dateTimeToLocale(new Date(updateTime), true);
          return true;
        }
        return false;
      });
      devicesDetail["ed3e2219-ff72-4405-88fb-8dab24030770"] = <DeviceDetail>detailUpdated;

      logger.trace('state.devices after telemetry update', JSON.stringify(state.devices, skipRefs, 2));
      expect(state.devices).toMatchObject(devicesDetail);
    }
  )
  mockProvider.pushSubscriptionUpdate(<DeviceUserUpdate>{
    deviceID: "ed3e2219-ff72-4405-88fb-8dab24030770",
    userID: "95e579be-a365-4268-bed0-17df80ef3dce",
    deviceUser: {
      bytesDownloaded: '1348',
      bytesUploaded: '832',
      lastAccessTime: updateTime,
      lastConnectSpace: {
        spaceID: "af296bd0-1186-42f0-b7ca-90980d22b961",
        spaceName: "bob's space #1"
      }
    }
  }, "ed3e2219-ff72-4405-88fb-8dab24030770", "95e579be-a365-4268-bed0-17df80ef3dce");
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

it('retrieves a users list of spaces', async () => {
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
        status: SpaceStatus.shutdown,
        version: "2.0.1",
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
      const detail = spacesDetail["d83b7d95-5681-427d-a65a-5d8a868d72e9"]
      const detailUpdated = {
        ...detail,
        dataUsageIn: "16.7 MiB",
        dataUsageOut: "5.6 MiB",
        bytesDownloaded: 5819939,
        bytesUploaded: 17487730,
      }
      detailUpdated.users.find((item, i, users) => {
        if (item.userID == "95e579be-a365-4268-bed0-17df80ef3dce") {
          item.status = UserAccessStatus.active;
          item.dataUsageIn = "7.3 MiB";
          item.dataUsageOut = "5.2 MiB";
          item.lastConnectTime = dateTimeToLocale(new Date(updateTime), true);
          return true;
        }
        return false;
      });
      spacesDetail["d83b7d95-5681-427d-a65a-5d8a868d72e9"] = <SpaceDetail>detailUpdated;

      logger.trace('state.spaces after telemetry update', JSON.stringify(state.spaces, skipRefs(), 2));
      expect(state.spaces).toMatchObject(spacesDetail);
    }
  )
  mockProvider.pushSubscriptionUpdate(<SpaceUserUpdate>{
    spaceID: "d83b7d95-5681-427d-a65a-5d8a868d72e9",
    userID: "95e579be-a365-4268-bed0-17df80ef3dce",
    spaceUser: {
      status: "active",
      bytesDownloaded: '5432546',
      bytesUploaded: '7654352',
      lastConnectTime: updateTime,
    }
  }, "d83b7d95-5681-427d-a65a-5d8a868d72e9", "95e579be-a365-4268-bed0-17df80ef3dce");
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

it('retrieves a users list of apps', async () => {
  mockProvider.setLoggedInUser('bob');

  stateTester.expectStateTest(GET_USER_APPS, ActionResult.pending);
  stateTester.expectStateTest(
    GET_USER_APPS, ActionResult.success,
    (counter, state, status) => {
      const userApps = <AppUser[]>mockProvider.user!.apps!.appUsers!;

      expect(state.userApps).toEqual(userApps);
      expect(state.apps).toMatchObject(appsDetail);
    }
  );
  stateTester.expectStateTest(SUBSCRIBE_TO_APP_UPDATES, ActionResult.pending);
  stateTester.expectStateTest(SUBSCRIBE_TO_APP_TELEMETRY, ActionResult.pending);
  stateTester.expectStateTest(SUBSCRIBE_TO_APP_UPDATES, ActionResult.success);
  stateTester.expectStateTest(SUBSCRIBE_TO_APP_TELEMETRY, ActionResult.success);
  dispatch.userspaceService!.getUserApps();
  await stateTester.done();

  // send app update
  let lastSeen = Date.now();
  stateTester.expectState(1, undefined,
    (counter, state, status) => {

      // update expected value and compare with actual
      const appDetail = appsDetail["9371d345-a363-4222-ba95-6840e18453ac"]
      const appInfoUpdated = {
        ...appDetail,
        name: "app #2 in bob's space #1 updated",
        status: AppStatus.running,
        version: "0.1.1",
        lastSeen: dateTimeToLocale(new Date(lastSeen), false),
      }
      appsDetail["9371d345-a363-4222-ba95-6840e18453ac"] = appInfoUpdated;

      logger.trace('state.app after device update', JSON.stringify(state.apps, skipRefs, 2));
      expect(state.apps).toMatchObject(appsDetail);
    }
  )
  mockProvider.pushSubscriptionUpdate(<AppUpdate>{
    __typename: "AppUpdate",
    appID: "9371d345-a363-4222-ba95-6840e18453ac",
    numUsers: 2,
    app: {
      __typename: "App",
      appName: "app #2 in bob's space #1 updated",
      status: AppStatus.running,
      version: "0.1.1",
      lastSeen
    }
  }, "9371d345-a363-4222-ba95-6840e18453ac");
  await stateTester.done();

  // send app telemetry
  let updateTime = Date.now();
  stateTester.expectState(1, undefined,
    (counter, state, status) => {

      // update expected value and compare with actual
      const detail = appsDetail["9371d345-a363-4222-ba95-6840e18453ac"]
      const detailUpdated = {
        ...detail,
      }
      detailUpdated.users.find((item, i, users) => {
        if (item.userID == "a645c56e-f454-460f-8324-eff15357e973") {
          item.lastAccessedTime = dateTimeToLocale(new Date(updateTime), true);
          return true;
        }
        return false;
      });
      appsDetail["9371d345-a363-4222-ba95-6840e18453ac"] = <AppDetail>detailUpdated;

      logger.trace('state.apps after telemetry update', JSON.stringify(state.apps, skipRefs(), 2));
      expect(state.apps).toMatchObject(appsDetail);
    }
  )
  mockProvider.pushSubscriptionUpdate(<AppUserUpdate>{
    appID: "9371d345-a363-4222-ba95-6840e18453ac",
    userID: "a645c56e-f454-460f-8324-eff15357e973",
    appUser: {
      lastAccessedTime: updateTime,
    }
  }, "9371d345-a363-4222-ba95-6840e18453ac", "a645c56e-f454-460f-8324-eff15357e973");
  await stateTester.done();
});

const devicesDetail: { [deviceID: string]: DeviceDetail } = {
  "c5021ecb-7c69-4950-a53c-fd4d5ca73b6f": {
    deviceID: "c5021ecb-7c69-4950-a53c-fd4d5ca73b6f",
    name: "tom's device #1",
    accessStatus: UserAccessStatus.active,
    type: "MacBook",
    version: "app/darwin:arm64/1.5.0",
    ownerAdmin: "Thomas T. Bradford",
    lastAccessed: dateTimeToLocale(date3, false),
    lastAccessedBy: "Thomas T. Bradford",
    lastSpaceConnectedTo: "bob's space #2",
    dataUsageIn: "21 bytes",
    dataUsageOut: "12 bytes",
    isOwned: true,
    bytesDownloaded: 21,
    bytesUploaded: 12,
    lastAccessedTime: date3.getTime(),
    settings: {},
    users: [
      {
        userID: "a645c56e-f454-460f-8324-eff15357e973",
        userName: "tom",
        fullName: "Thomas T. Bradford",
        status: UserAccessStatus.active,
        dataUsageIn: "21 bytes",
        dataUsageOut: "12 bytes",
        lastAccessTime: dateTimeToLocale(date3),
        lastSpaceConnectedTo: "bob's space #2"
      },
      {
        userID: "95e579be-a365-4268-bed0-17df80ef3dce",
        userName: "deb",
        fullName: "Deborah Plynk Sanders",
        status: UserAccessStatus.pending,
        dataUsageIn: "0 bytes",
        dataUsageOut: "0 bytes",
        lastAccessTime: "never"
      }
    ]
  },
  "ed3e2219-ff72-4405-88fb-8dab24030770": {
    deviceID: "ed3e2219-ff72-4405-88fb-8dab24030770",
    name: "tom's device #2",
    accessStatus: UserAccessStatus.active,
    type: "iPhone",
    version: "client/ios:arm64/1.1.0",
    ownerAdmin: "Thomas T. Bradford",
    lastAccessed: dateTimeToLocale(date3, false),
    lastAccessedBy: "Deborah Plynk Sanders",
    lastSpaceConnectedTo: "bob's space #2",
    dataUsageIn: "65 bytes",
    dataUsageOut: "56 bytes",
    isOwned: true,
    bytesDownloaded: 65,
    bytesUploaded: 56,
    lastAccessedTime: date3.getTime(),
    settings: {},
    users: [
      {
        userID: "a645c56e-f454-460f-8324-eff15357e973",
        userName: "tom",
        fullName: "Thomas T. Bradford",
        status: UserAccessStatus.active,
        dataUsageIn: "43 bytes",
        dataUsageOut: "34 bytes",
        lastAccessTime: dateTimeToLocale(date1),
        lastSpaceConnectedTo: "tom's space #1"
      },
      {
        userID: "d12935f9-55b3-4514-8346-baaf99d6e6fa",
        userName: "bob",
        fullName: "Bobby J. Brown",
        status: UserAccessStatus.pending,
        dataUsageIn: "0 bytes",
        dataUsageOut: "0 bytes",
        lastAccessTime: "never",
        lastSpaceConnectedTo: ""
      },
      {
        userID: "95e579be-a365-4268-bed0-17df80ef3dce",
        userName: "deb",
        fullName: "Deborah Plynk Sanders",
        status: UserAccessStatus.active,
        dataUsageIn: "65 bytes",
        dataUsageOut: "56 bytes",
        lastAccessTime: dateTimeToLocale(date3),
        lastSpaceConnectedTo: "bob's space #2"
      }
    ]
  },
  "f25b8176-dbb7-4a8a-b08d-5f8e56cc4303": {
    deviceID: "f25b8176-dbb7-4a8a-b08d-5f8e56cc4303",
    name: "bob's device #1",
    accessStatus: UserAccessStatus.active,
    type: "UbuntuServer",
    version: "cli/linux:amd64/1.5.0",
    ownerAdmin: "Bobby J. Brown",
    lastAccessed: dateTimeToLocale(date3, false),
    lastAccessedBy: "",
    lastSpaceConnectedTo: "bob's space #2",
    dataUsageIn: "836 bytes",
    dataUsageOut: "583 bytes",
    isOwned: false,
    bytesDownloaded: 836,
    bytesUploaded: 583,
    lastAccessedTime: date3.getTime(),
    settings: {},
    users: []
  }
};

const spacesDetail: { [spaceID: string]: SpaceDetail } = {
  "d83b7d95-5681-427d-a65a-5d8a868d72e9": {
    spaceID: "d83b7d95-5681-427d-a65a-5d8a868d72e9",
    name: "tom's space #1",
    accessStatus: UserAccessStatus.active,
    status: SpaceStatus.running,
    ownerAdmin: "Thomas T. Bradford",
    lastSeen: "never",
    clientsConnected: 2,
    dataUsageIn: "12.6 MiB",
    dataUsageOut: "5.0 MiB",
    cloudProvider: "aws",
    type: "recipe #1",
    location: "us-east-1",
    version: "2.0.0",
    isOwned: true,
    isEgressNode: true,
    bytesDownloaded: 5245122,
    bytesUploaded: 13221771,
    spaceDefaults: {
      isSpaceAdmin: false,
      canUseSpaceForEgress: false,
      enableSiteBlocking: false
    },
    users: [
      {
        userID: "a645c56e-f454-460f-8324-eff15357e973",
        userName: "tom",
        fullName: "Thomas T. Bradford",
        status: UserAccessStatus.active,
        egressAllowed: "yes",
        dataUsageIn: "378.3 KiB",
        dataUsageOut: "9.4 MiB",
        lastConnectTime: dateTimeToLocale(date3),
        lastDeviceConnected: ""
      },
      {
        userID: "d12935f9-55b3-4514-8346-baaf99d6e6fa",
        userName: "bob",
        fullName: "Bobby J. Brown",
        status: UserAccessStatus.pending,
        egressAllowed: "yes",
        dataUsageIn: "0 bytes",
        dataUsageOut: "0 bytes",
        lastConnectTime: "never",
        lastDeviceConnected: ""
      },
      {
        userID: "95e579be-a365-4268-bed0-17df80ef3dce",
        userName: "deb",
        fullName: "Deborah Plynk Sanders",
        status: UserAccessStatus.active,
        egressAllowed: "yes",
        dataUsageIn: "4.6 MiB",
        dataUsageOut: "3.2 MiB",
        lastConnectTime: dateTimeToLocale(date2),
        lastDeviceConnected: ""
      }
    ]
  },
  "9a5242dc-0681-4d67-9fe7-bdc691d1a18d": {
    spaceID: "9a5242dc-0681-4d67-9fe7-bdc691d1a18d",
    name: "bob's space #2",
    accessStatus: UserAccessStatus.active,
    status: SpaceStatus.running,
    ownerAdmin: "Bobby J. Brown",
    lastSeen: "never",
    clientsConnected: 0,
    dataUsageIn: "7.9 MiB",
    dataUsageOut: "2.3 MiB",
    cloudProvider: "gcp",
    type: "recipe #2",
    location: "us-east1",
    version: "1.2.0",
    isOwned: false,
    isEgressNode: true,
    bytesDownloaded: 2389343,
    bytesUploaded: 8239884,
    spaceDefaults: {
      isSpaceAdmin: false,
      canUseSpaceForEgress: false,
      enableSiteBlocking: false
    },
    users: []
  }
};

const appsDetail: { [appID: string]: AppDetail } = {
  '6410af20-45e4-4bca-a499-c7680b454491': {
    appID: '6410af20-45e4-4bca-a499-c7680b454491',
    name: "app #1 in bob's space #1",
    status: AppStatus.running,
    lastSeen: 'never',
    installedSpace: "bob's space #1",
    spaceOwner: 'Bobby J. Brown',
    version: '0.7.5',
    isOwned: true,
    users: [
      {
        userID: 'd12935f9-55b3-4514-8346-baaf99d6e6fa',
        userName: 'bob',
        fullName: 'Bobby J. Brown',
        lastAccessedTime: 'never'
      }
    ]
  },
  '9371d345-a363-4222-ba95-6840e18453ac': {
    appID: '9371d345-a363-4222-ba95-6840e18453ac',
    name: "app #2 in bob's space #1",
    status: AppStatus.shutdown,
    lastSeen: 'never',
    installedSpace: "bob's space #1",
    spaceOwner: 'Bobby J. Brown',
    version: '0.1.0',
    isOwned: true,
    users: [
      {
        userID: 'd12935f9-55b3-4514-8346-baaf99d6e6fa',
        userName: 'bob',
        fullName: 'Bobby J. Brown',
        lastAccessedTime: 'never'
      },
      {
        userID: 'a645c56e-f454-460f-8324-eff15357e973',
        userName: 'tom',
        fullName: 'Thomas T. Bradford',
        lastAccessedTime: 'never'
      }
    ]
  },
  'c715cede-091c-4a25-b003-f80123236548': {
    appID: 'c715cede-091c-4a25-b003-f80123236548',
    name: "app #3 in bob's space #1",
    status: AppStatus.shutdown,
    lastSeen: 'never',
    installedSpace: "bob's space #1",
    spaceOwner: 'Bobby J. Brown',
    version: '0.1.5',
    isOwned: true,
    users: [
      {
        userID: 'd12935f9-55b3-4514-8346-baaf99d6e6fa',
        userName: 'bob',
        fullName: 'Bobby J. Brown',
        lastAccessedTime: 'never'
      }
    ]
  }
}

// remove circular reference when stringifying 
// the device/space detail lists
const skipRefs = () => {
  return (key: any, value: any) => {
    if (key == 'deviceUser' || key == 'spaceUser' || key == 'appUser') {
      return;
    }
    return value;
  };
};