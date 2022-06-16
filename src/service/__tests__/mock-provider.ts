import ProviderInterface from '../provider';

import {
  UserRef,
  User,
  Device,
  DeviceUser,
  UserAccessStatus,
  Space,
  SpaceUser,
  App,
  AppUser,
  UserUpdate,
  DeviceUpdate,
  DeviceUserUpdate,
  SpaceUpdate,
  SpaceUserUpdate,
  SpaceStatus,
  AppUpdate,
  AppUserUpdate,
  Key,
  AppStatus
} from '../../model/types';

import { UserSpaceActionProps } from '../actions';
import UserSpaceService from '../user-space-service';

import { 
  BROADCAST, 
  BroadCastPayload,
  createAction 
} from '@appbricks/utils';
import {
  ActionTester,
  testActionDispatcher
} from '@appbricks/test-utils';

// date older than a month
export const date1 = new Date();
date1.setMonth(date1.getMonth() - 1.5);
// date 5 mins old
export const date2 = new Date();
date2.setMinutes(date2.getMinutes() - 5);
// date 2 mins old
export const date3 = new Date();
date3.setMinutes(date3.getMinutes() - 2);

export const initServiceDispatch = (
  actionTester: ActionTester
): {
  sendLoginEvent?: (userID: string) => void
  dispatch: UserSpaceActionProps
  mockProvider: MockProvider
} => {

  const mockProvider = new MockProvider();
  const authService = new UserSpaceService(mockProvider)

  let sendLoginEvent: (userID: string) => void = (userID: string) => {};

  const dispatch = testActionDispatcher<UserSpaceActionProps>(
    'userspace',
    actionTester,
    authService.epics(),
    dispatch => {
      sendLoginEvent = (userID: string) => {
        dispatch(createAction<BroadCastPayload>(BROADCAST, { __typename: 'UserLogin', userID }))
      }
      return UserSpaceService.dispatchProps(dispatch)
    }
  );

  return {
    sendLoginEvent,
    dispatch,
    mockProvider
  };
}

/**
 * Mock User-Space API provider.
 */
export default class MockProvider implements ProviderInterface {

  // mock data
  users: User[];
  devices: Device[];
  deviceUsers: DeviceUser[];
  spaces: Space[];
  spaceUsers: SpaceUser[];
  apps: App[];
  appUsers: AppUser[];

  subscriptionMap: { [id: string]: { update: (data: any) => void, error: (err: any) => void} } = {}

  // logged in user
  user?: User;

  constructor() {
    const {
      users,
      devices, deviceUsers,
      spaces, spaceUsers,
      apps, appUsers
    } = loadMockData();

    this.users = users;
    this.devices = devices;
    this.deviceUsers = deviceUsers;
    this.spaces = spaces;
    this.spaceUsers = spaceUsers;
    this.apps = apps;
    this.appUsers = appUsers;
  }

  pushSubscriptionUpdate(data: any, ...id: string[]) {
    const subscription = this.subscriptionMap[id.join('|')];
    if (subscription) {
      subscription.update(data);
    } else {
      throw new Error(`subscription ${id.join('|')} not found`)
    }
  }

  pushSubscriptionError(err: any, ...id: string[]) {
    const subscription = this.subscriptionMap[id.join('|')];
    if (subscription) {
      subscription.error(err);
    } else {
      throw new Error(`subscription ${id.join('|')} not found`)
    }
  }

  setLoggedInUser(loggedInUser: string) {
    this.user = this.users.find(user => user.userName == loggedInUser);
    expect(this.user).toBeDefined();
  }

  async userSearch(namePrefix: string, limit?: number) {

    const users = this.users
      .filter(user => user.userName!.startsWith(namePrefix))
      .map(user =>
        <UserRef>{
          __typename: "UserRef",
          userID: user.userID,
          userName: user.userName,
          firstName: user.firstName,
          middleName: user.middleName,
          familyName: user.familyName
        }
      );

    if (limit) {
      return users.slice(0, limit);
    } else {
      return users;
    }
  }

  async subscribeToUserUpdates(userID: string, update: (data: UserUpdate) => void, error: (error: any) => void) {
    this.subscriptionMap[userID] = { update, error };
  }

  async unsubscribeFromUserUpdates(userID: string) {
    delete this.subscriptionMap[userID];
  }

  async getUserDevices() {
    return <DeviceUser[]>this.user!.devices!.deviceUsers!
      .filter(deviceUser => deviceUser!.status == UserAccessStatus.active);
  }

  async subscribeToDeviceUpdates(deviceID: string, update: (data: DeviceUpdate) => void, error: (error: any) => void) {
    this.subscriptionMap[deviceID] = { update, error };
  }

  async unsubscribeFromDeviceUpdates(deviceID: string) {
    delete this.subscriptionMap[deviceID];
  }

  async subscribeToDeviceUserUpdates(deviceID: string, userID: string, update: (sata: DeviceUserUpdate) => void, error: (error: any) => void) {
    this.subscriptionMap[deviceID + '|' + userID] = { update, error };
  }

  async unsubscribeFromDeviceUserUpdates(deviceID: string, userID: string) {
    delete this.subscriptionMap[deviceID + '|' + userID];
  }

  async getDeviceAccessRequests(deviceID: string) {
    const deviceUser = this.user!.devices!.deviceUsers!
      .find(deviceUser => deviceUser!.isOwner && deviceUser!.device!.deviceID == deviceID);
    if (!deviceUser) {
      throw new Error(`user does not own a device with ID ${deviceID}`);
    }

    return <DeviceUser[]>deviceUser.device!.users!.deviceUsers!
      .filter(deviceUser => deviceUser!.status == UserAccessStatus.pending);
  }

  async activateDeviceUser(deviceID: string, userID: string) {
    const deviceUser = this.user!.devices!.deviceUsers!
      .find(deviceUser => deviceUser!.isOwner && deviceUser!.device!.deviceID == deviceID);
    if (!deviceUser) {
      throw new Error(`user does not own a device with ID ${deviceID}`);
    }

    const deviceUserToActivate = deviceUser.device!.users!.deviceUsers!
      .find(deviceUser => deviceUser!.user!.userID == userID && deviceUser!.status == UserAccessStatus.pending);
    if (!deviceUserToActivate) {
      throw new Error(`user with ID ${userID} does not need activation on device with ID ${deviceID}`);
    }

    deviceUserToActivate.status = UserAccessStatus.active;
    return deviceUserToActivate;
  }

  async deleteDeviceUser(deviceID: string, userID?: string) {
    const deviceUser = this.user!.devices!.deviceUsers!
      .find(deviceUser => deviceUser!.isOwner && deviceUser!.device!.deviceID == deviceID);
    if (!deviceUser) {
      throw new Error(`user does not own a device with ID ${deviceID}`);
    }

    // delete device association with user
    let deleteAt = deviceUser.device!.users!.deviceUsers!
      .findIndex(deviceUser => deviceUser!.user!.userID == userID);
    if (deleteAt == -1) {
      throw new Error(`user with ID ${userID} is not associated with device with ID ${deviceID}`);
    }
    const deletedDeviceUser = deviceUser.device!.users!.deviceUsers!.splice(deleteAt, 1)[0];
    deviceUser.device!.users!.totalCount!--;

    // delete user association with device
    const user = this.users.find(user => user.userID == userID)!
    deleteAt = user.devices!.deviceUsers!
      .findIndex(deviceUser => deviceUser!.device!.deviceID == deviceID);
    user.devices!.deviceUsers!.splice(deleteAt, 1);

    return deletedDeviceUser!;
  }

  async deleteDevice(deviceID: string) {
    const deviceUser = this.user!.devices!.deviceUsers!
      .find(deviceUser => deviceUser!.isOwner && deviceUser!.device!.deviceID == deviceID);
    if (!deviceUser) {
      throw new Error(`user does not own a device with ID ${deviceID}`);
    }

    let deleteAt = this.devices.findIndex(device => device.deviceID == deviceID);
    this.devices.splice(deleteAt, 1);

    this.deviceUsers.forEach((deviceUser, index) => {
      if (deviceUser.device!.deviceID == deviceID) {
        this.deviceUsers.splice(index, 1);
      }
    });

    this.users.forEach(user => {
      if (user.devices) {
        user.devices.deviceUsers!.forEach((deviceUser, index) => {
          if (deviceUser!.device!.deviceID == deviceID) {
            user.devices!.deviceUsers!.splice(index, 1);
            user.devices!.totalCount!--;
          }
        });
      }
    });
  }

  async updateDevice(deviceID: string, deviceKey?: Key, clientVersion?: string, settings?: string) {
    const device = this.user!.devices!.deviceUsers!
      .find(deviceUser => deviceUser!.device!.deviceID == deviceID)!.device!;

    device.publicKey = deviceKey?.publicKey;
    device.clientVersion = clientVersion;
    device.settings = settings;

    return device;
  }

  async getUserSpaces() {
    return <SpaceUser[]>this.user!.spaces!.spaceUsers!
      .filter(spaceUser => spaceUser!.status == UserAccessStatus.active)
  }

  async subscribeToSpaceUpdates(spaceID: string, update: (data: SpaceUpdate) => void, error: (error: any) => void) {
    this.subscriptionMap[spaceID] = { update, error };
  }

  async unsubscribeFromSpaceUpdates(spaceID: string) {
    delete this.subscriptionMap[spaceID];
  }

  async subscribeToSpaceUserUpdates(spaceID: string, userID: string, update: (data: SpaceUserUpdate) => void, error: (error: any) => void) {
    this.subscriptionMap[spaceID + '|' + userID] = { update, error };
  }

  async unsubscribeFromSpaceUserUpdates(spaceID: string, userID: string) {
    delete this.subscriptionMap[spaceID + '|' + userID];
  }

  async getSpaceInvitations() {
    return <SpaceUser[]>this.user!.spaces!.spaceUsers!
      .filter(spaceUser => spaceUser!.status == UserAccessStatus.pending);
  }

  async inviteSpaceUser(spaceID: string, userID: string, isEgressNode: boolean) {
    const spaceOwner = this.user!.spaces!.spaceUsers!
      .find(spaceUser => spaceUser!.isOwner && spaceUser!.space!.spaceID == spaceID);
    if (!spaceOwner) {
      throw new Error(`user does not own a space with ID ${spaceID}`);
    }

    const checkUserToInvite = spaceOwner.space!.users!.spaceUsers!
      .find(spaceUser => spaceUser!.user!.userID == userID);
    if (checkUserToInvite) {
      throw new Error(`user with ID ${userID} already associated with space with ID ${spaceID}`);
    }

    const userToInvite = this.users.find(user => user.userID == userID);
    const spaceUserInvite = <SpaceUser>{
      __typename: "SpaceUser",
      space: spaceOwner.space,
      user: userToInvite,
      isOwner: false,
      isEgressNode: isEgressNode,
      status: UserAccessStatus.pending,
      bytesUploaded: '0',
      bytesDownloaded: '0',
      lastConnectTime: 0,
    }

    userToInvite!.spaces!.spaceUsers!.push(spaceUserInvite);
    spaceOwner.space!.users!.spaceUsers!.push(spaceUserInvite);

    return spaceUserInvite;
  }

  async activateSpaceUser(spaceID: string, userID: string): Promise<SpaceUser> {
    const spaceUser = this.user!.spaces!.spaceUsers!
      .find(spaceUser => spaceUser!.isOwner && spaceUser!.space!.spaceID == spaceID);
    if (!spaceUser) {
      throw new Error(`user does not own a space with ID ${spaceID}`);
    }

    const spaceUserToDeactivate = spaceUser.space!.users!.spaceUsers!
      .find(spaceUser => spaceUser!.user!.userID == userID);
    if (!spaceUserToDeactivate) {
      throw new Error(`user with ID ${userID} is not associated with space with ID ${spaceID}`);
    }

    spaceUserToDeactivate.status = UserAccessStatus.active;
    return spaceUserToDeactivate;
  }

  async deactivateSpaceUser(spaceID: string, userID: string) {
    const spaceUser = this.user!.spaces!.spaceUsers!
      .find(spaceUser => spaceUser!.isOwner && spaceUser!.space!.spaceID == spaceID);
    if (!spaceUser) {
      throw new Error(`user does not own a space with ID ${spaceID}`);
    }

    const spaceUserToDeactivate = spaceUser.space!.users!.spaceUsers!
      .find(spaceUser => spaceUser!.user!.userID == userID);
    if (!spaceUserToDeactivate) {
      throw new Error(`user with ID ${userID} is not associated with space with ID ${spaceID}`);
    }

    spaceUserToDeactivate.status = UserAccessStatus.inactive;
    return spaceUserToDeactivate;
  }

  async deleteSpaceUser(spaceID: string, userID?: string) {
    const spaceUser = this.user!.spaces!.spaceUsers!
      .find(spaceUser => spaceUser!.isOwner && spaceUser!.space!.spaceID == spaceID);
    if (!spaceUser) {
      throw new Error(`user does not own a space with ID ${spaceID}`);
    }

    // delete space association with user
    let deleteAt = spaceUser.space!.users!.spaceUsers!
      .findIndex(spaceUser => spaceUser!.user!.userID == userID);
    if (deleteAt == -1) {
      throw new Error(`user with ID ${userID} is not associated with space with ID ${spaceID}`);
    }
    const deletedSpaceUser = spaceUser.space!.users!.spaceUsers!.splice(deleteAt, 1)[0];
    spaceUser.space!.users!.totalCount!--;

    // delete user association with space
    const user = this.users.find(user => user.userID == userID)!
    deleteAt = user.spaces!.spaceUsers!
      .findIndex(spaceUsers => spaceUsers!.space!.spaceID == spaceID);
    user.spaces!.spaceUsers!.splice(deleteAt, 1);

    return deletedSpaceUser!;
  }

  async deleteSpace(spaceID: string) {
    const spaceUser = this.user!.spaces!.spaceUsers!
      .find(spaceUser => spaceUser!.isOwner && spaceUser!.space!.spaceID == spaceID);
    if (!spaceUser) {
      throw new Error(`user does not own a space with ID ${spaceID}`);
    }

    let deleteAt = this.spaces.findIndex(space => space.spaceID == spaceID);
    this.spaces.splice(deleteAt, 1);

    this.spaceUsers.forEach((spaceUser, index) => {
      if (spaceUser.space!.spaceID == spaceID) {
        this.spaceUsers.splice(index, 1);
      }
    });

    this.users.forEach(user => {
      if (user.spaces) {
        user.spaces.spaceUsers!.forEach((spaceUser, index) => {
          if (spaceUser!.space!.spaceID == spaceID) {
            user.spaces!.spaceUsers!.splice(index, 1);
            user.spaces!.totalCount!--;
          }
        });
      }
    });
  }

  async updateSpace(spaceID: string, spaceKey?: Key, version?: string, settings?: string) {
    const space = this.user!.spaces!.spaceUsers!
      .find(spaceUser => spaceUser!.space!.spaceID == spaceID)!.space!;

    space.publicKey = spaceKey?.publicKey;
    space.version = version;
    space.settings = settings;

    return space;
  }

  async updateSpaceUser(spaceID: string, userID: string, isEgressNode: boolean) {
    const spaceUser = this.user!.spaces!.spaceUsers!
      .find(spaceUser => spaceUser!.space!.spaceID == spaceID)!.space!.users!.spaceUsers!
      .find(spaceUser => spaceUser!.user!.userID == userID)!;

    spaceUser.isEgressNode = isEgressNode;
    return spaceUser;
  }

  async acceptSpaceUserInvitation(spaceID: string) {
    const spaceUserInvitation = this.user!.spaces!.spaceUsers!
      .find(spaceUser => spaceUser!.space!.spaceID == spaceID && spaceUser!.status == UserAccessStatus.pending);
    if (!spaceUserInvitation) {
      throw new Error(`user does not have and invitation for space with ID ${spaceID}`);
    }

    spaceUserInvitation.status = UserAccessStatus.active;
    return spaceUserInvitation;
  }

  async leaveSpaceUser(spaceID: string) {
    const spaceUser = this.user!.spaces!.spaceUsers!
      .find(spaceUser => spaceUser!.space!.spaceID == spaceID);
    if (!spaceUser) {
      throw new Error(`user is not associated with a space with ID ${spaceID}`);
    }

    spaceUser.status = UserAccessStatus.inactive;
    return spaceUser;
  }

  async getUserApps() {
    return <AppUser[]>this.user!.apps!.appUsers;
  }

  async subscribeToAppUpdates(appID: string, update: (data: AppUpdate) => void, error: (error: any) => void) {
    this.subscriptionMap[appID] = { update, error };
  }

  async unsubscribeFromAppUpdates(spaceID: string) {
    delete this.subscriptionMap[spaceID];
  }

  async subscribeToAppUserUpdates(appID: string, userID: string, update: (data: AppUserUpdate) => void, error: (error: any) => void) {
    this.subscriptionMap[appID + '|' + userID] = { update, error };
  }

  async unsubscribeFromAppUserUpdates(spaceID: string, userID: string) {
    delete this.subscriptionMap[spaceID + '|' + userID];
  }

  async addAppUser(appID: string, userID: string) {
    const app = this.apps.find(app => app.appID == appID);
    if (!app) {
      throw new Error(`unknown app ID ${appID}`);
    }

    const user = this.users.find(user => user.userID == userID);
    if (!user) {
      throw new Error(`user with ID ${userID} does not exist`);
    }

    const appUser = <AppUser>{
      __typename: "AppUser",
      app: app,
      user: user,
      lastAccessTime: 0,
    }
    user.apps!.totalCount!++;
    user.apps!.appUsers!.push(appUser);
    app.users!.totalCount!++;
    app.users!.appUsers!.push(appUser);

    return appUser;
  }

  async deleteAppUser(appID: string, userID?: string) {

    let app = this.user!.apps!.appUsers!.find(appUser => appUser!.app!.appID == appID)!.app;
    let deleteAt = app!.users!.appUsers!.findIndex(appUser => appUser!.user!.userID == userID);
    let appUser = app!.users!.appUsers![deleteAt];
    
    app!.users!.appUsers!.splice(deleteAt, 1);
    app!.users!.totalCount!--;

    let user = this!.users!.find(user => user.userID! == userID);
    deleteAt = user!.apps!.appUsers!.findIndex(appUser => appUser!.app!.appID == appID);
    user!.apps!.appUsers!.splice(deleteAt, 1);
    user!.apps!.totalCount!--;

    return appUser!;
  }
 
  async deleteApp(appID: string) {
    let deleteAt = this.user!.apps!.appUsers!.findIndex(appUser => appUser!.app!.appID == appID);
    let appUser = this.user!.apps!.appUsers![deleteAt];

    this.user!.apps!.appUsers!.splice(deleteAt, 1);
    this.user!.apps!.totalCount!--;

    deleteAt = appUser!.app!.space!.apps!.spaceApps!.findIndex(spaceApp => spaceApp!.appID == appID);
    appUser!.app!.space!.apps!.spaceApps!.splice(deleteAt, 1);
    
    return
  }
 
  async unsubscribeAll() {
    return
  }
}

// Mock Data
function loadMockData() {

  const users: User[] = [ {
    __typename: 'User',
    userID: 'a645c56e-f454-460f-8324-eff15357e973',
    userName: 'tom',
    firstName: 'Thomas',
    middleName: 'T',
    familyName: 'Bradford',
    emailAddress: 'tom@acme.com',
    mobilePhone: '+19781112233',
    confirmed: true,
    publicKey: 'tom\'s public key',
    certificate: 'tom\'s certificate',
  }, {
    __typename: 'User',
    userID: 'd12935f9-55b3-4514-8346-baaf99d6e6fa',
    userName: 'bob',
    firstName: 'Bobby',
    middleName: 'J',
    familyName: 'Brown',
    emailAddress: 'bob@acme.com',
    mobilePhone: '+19784445566',
    confirmed: true,
    publicKey: 'bob\'s public key',
    certificate: 'bob\'s certificate',
  }, {
    __typename: 'User',
    userID: '95e579be-a365-4268-bed0-17df80ef3dce',
    userName: 'deb',
    firstName: 'Deborah',
    middleName: 'Plynk',
    familyName: 'Sanders',
    emailAddress: 'deb@acme.com',
    mobilePhone: '+19787778899',
    confirmed: true,
    publicKey: 'deb\'s public key',
    certificate: 'deb\'s certificate',
  }, {
    __typename: 'User',
    userID: 'c18d325c-c0f1-4ba3-8898-026b48eb9bdc',
    userName: 'debbie',
    emailAddress: 'debbie@acme.com',
    mobilePhone: '+19787778899',
    confirmed: true,
    publicKey: 'debbie\'s public key',
    certificate: 'debbie\'s certificate',
  }, {
    __typename: 'User',
    userID: 'e745d48e-d9ba-4277-9d9e-fc13197eff38',
    userName: 'denny',
    emailAddress: 'denny@acme.com',
    mobilePhone: '+19787778899',
    confirmed: true,
    publicKey: 'denny\'s public key',
    certificate: 'denny\'s certificate',
  }, {
    __typename: 'User',
    userID: '1ade82fc-750e-433c-aa30-4c5764ff02fb',
    userName: 'darren',
    emailAddress: 'darren@acme.com',
    mobilePhone: '+19787778899',
    confirmed: true,
    publicKey: 'darren\'s public key',
    certificate: 'darren\'s certificate',
  }, {
    __typename: 'User',
    userID: '8e0a1535-bf9e-4548-8602-ce3b0f619734',
    userName: 'danny',
    emailAddress: 'danny@acme.com',
    mobilePhone: '+19787778899',
    confirmed: true,
    publicKey: 'danny\'s public key',
    certificate: 'danny\'s certificate',
  } ];

  const devices: Device[] = [ {
    __typename: 'Device',
    deviceID: 'c5021ecb-7c69-4950-a53c-fd4d5ca73b6f',
    deviceName: 'tom\'s device #1',
    owner: {
      __typename: 'UserRef',
      userID: users[0].userID,
      userName: users[0].userName,
      firstName: users[0].firstName,
      middleName: users[0].middleName,
      familyName: users[0].familyName
    },
    deviceType: 'MacBook',
    clientVersion: 'app/darwin:arm64/1.5.0',
    publicKey: 'tom\'s device #1 public key',
    certificate: 'tom\'s device #1 certificate key',
  }, {
    __typename: 'Device',
    deviceID: 'ed3e2219-ff72-4405-88fb-8dab24030770',
    deviceName: 'tom\'s device #2',
    owner: {
      __typename: 'UserRef',
      userID: users[0].userID,
      userName: users[0].userName,
      firstName: users[0].firstName,
      middleName: users[0].middleName,
      familyName: users[0].familyName
    },
    deviceType: 'iPhone',
    clientVersion: 'client/ios:arm64/1.1.0',
    publicKey: 'tom\'s device #2 public key',
    certificate: 'tom\'s device #2 certificate key',
  }, {
    __typename: 'Device',
    deviceID: 'f25b8176-dbb7-4a8a-b08d-5f8e56cc4303',
    deviceName: 'bob\'s device #1',
    owner: {
      __typename: 'UserRef',
      userID: users[1].userID,
      userName: users[1].userName,
      firstName: users[1].firstName,
      middleName: users[1].middleName,
      familyName: users[1].familyName
    },
    deviceType: 'UbuntuServer',
    clientVersion: 'cli/linux:amd64/1.5.0',
    publicKey: 'bob\'s device #1 public key',
    certificate: 'bob\'s device #1 certificate key',
  }, {
    __typename: 'Device',
    deviceID: '9bb6399-6c7a-4cd5-a536-5a4d74482020',
    deviceName: 'bob\'s device #2',
    owner: {
      __typename: 'UserRef',
      userID: users[1].userID,
      userName: users[1].userName,
      firstName: users[1].firstName,
      middleName: users[1].middleName,
      familyName: users[1].familyName
    },
    deviceType: 'UbuntuServer',
    clientVersion: 'client/android:arm64/1.1.0',
    publicKey: 'bob\'s device #2 public key',
    certificate: 'bob\'s device #2 certificate key',
  } ];

  const deviceUsers: DeviceUser[] = [ {
    __typename: "DeviceUser",
    device: devices[0],
    user: users[0],
    isOwner: true,
    status: UserAccessStatus.active,
    bytesUploaded: '12',
    bytesDownloaded: '21',
    lastAccessTime: date3.getTime(),
  }, {
    __typename: "DeviceUser",
    device: devices[1],
    user: users[0],
    isOwner: true,
    status: UserAccessStatus.active,
    bytesUploaded: '34',
    bytesDownloaded: '43',
    lastAccessTime: date1.getTime(),
  }, {
    __typename: "DeviceUser",
    device: devices[2],
    user: users[1],
    isOwner: true,
    status: UserAccessStatus.active,
    bytesUploaded: '823',
    bytesDownloaded: '465',
    lastAccessTime: date2.getTime(),
  }, {
    __typename: "DeviceUser",
    device: devices[2],
    user: users[0],
    isOwner: false,
    status: UserAccessStatus.active,
    bytesUploaded: '583',
    bytesDownloaded: '836',
    lastAccessTime: date3.getTime(),
  }, {
    __typename: "DeviceUser",
    device: devices[1],
    user: users[1],
    isOwner: false,
    status: UserAccessStatus.pending,
    bytesUploaded: '0',
    bytesDownloaded: '0',
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[0],
    user: users[2],
    isOwner: false,
    status: UserAccessStatus.pending,
    bytesUploaded: '0',
    bytesDownloaded: '0',
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[1],
    user: users[2],
    isOwner: false,
    status: UserAccessStatus.active,
    bytesUploaded: '56',
    bytesDownloaded: '65',
    lastAccessTime: date3.getTime(),
  }, {
    __typename: "DeviceUser",
    device: devices[2],
    user: users[2],
    isOwner: false,
    status: UserAccessStatus.pending,
    bytesUploaded: '0',
    bytesDownloaded: '0',
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[3],
    user: users[1],
    isOwner: true,
    status: UserAccessStatus.active,
    bytesUploaded: '0',
    bytesDownloaded: '0',
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[3],
    user: users[0],
    isOwner: false,
    status: UserAccessStatus.pending,
    bytesUploaded: '0',
    bytesDownloaded: '0',
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[3],
    user: users[2],
    isOwner: false,
    status: UserAccessStatus.pending,
    bytesUploaded: '0',
    bytesDownloaded: '0',
    lastAccessTime: 0,
  } ];

  devices[0].users = {
    __typename: "DeviceUsersConnection",
    totalCount: 2,
    deviceUsers: [
      deviceUsers[0],
      deviceUsers[5],
    ]
  };
  devices[1].users = {
    __typename: "DeviceUsersConnection",
    totalCount: 3,
    deviceUsers: [
      deviceUsers[1],
      deviceUsers[4],
      deviceUsers[6],
    ]
  };
  devices[2].users = {
    __typename: "DeviceUsersConnection",
    totalCount: 3,
    deviceUsers: [
      deviceUsers[2],
      deviceUsers[3],
      deviceUsers[7],
    ]
  };
  devices[3].users = {
    __typename: "DeviceUsersConnection",
    totalCount: 3,
    deviceUsers: [
      deviceUsers[8],
      deviceUsers[9],
      deviceUsers[10],
    ]
  };

  users[0].devices = {
    __typename: "DeviceUsersConnection",
    totalCount: 4,
    deviceUsers: [
      deviceUsers[0],
      deviceUsers[1],
      deviceUsers[3],
      deviceUsers[9],
    ]
  };
  users[1].devices = {
    __typename: "DeviceUsersConnection",
    totalCount: 3,
    deviceUsers: [
      deviceUsers[2],
      deviceUsers[4],
      deviceUsers[8],
    ]
  };
  users[2].devices = {
    __typename: "DeviceUsersConnection",
    totalCount: 4,
    deviceUsers: [
      deviceUsers[5],
      deviceUsers[6],
      deviceUsers[7],
      deviceUsers[10],
    ]
  };

  const spaces: Space[] = [ {
    __typename: "Space",
    spaceID: 'd83b7d95-5681-427d-a65a-5d8a868d72e9',
    spaceName: 'tom\'s space #1',
    owner: {
      __typename: 'UserRef',
      userID: users[0].userID,
      userName: users[0].userName,
      firstName: users[0].firstName,
      middleName: users[0].middleName,
      familyName: users[0].familyName
    },
    recipe: 'recipe #1',
    iaas: 'aws',
    region: 'us-east-1',
    version: '2.0.0',
    status: SpaceStatus.running,
    lastSeen: 0,
  }, {
    __typename: "Space",
    spaceID: 'af296bd0-1186-42f0-b7ca-90980d22b961',
    spaceName: 'bob\'s space #1',
    owner: {
      __typename: 'UserRef',
      userID: users[1].userID,
      userName: users[1].userName,
      firstName: users[1].firstName,
      middleName: users[1].middleName,
      familyName: users[1].familyName
    },
    recipe: 'recipe #1',
    iaas: 'aws',
    region: 'us-west-1',
    version: '1.5.0',
    status: SpaceStatus.shutdown,
    lastSeen: 0,
  }, {
    __typename: "Space",
    spaceID: '9a5242dc-0681-4d67-9fe7-bdc691d1a18d',
    spaceName: 'bob\'s space #2',
    owner: {
      __typename: 'UserRef',
      userID: users[1].userID,
      userName: users[1].userName,
      firstName: users[1].firstName,
      middleName: users[1].middleName,
      familyName: users[1].familyName
    },
    recipe: 'recipe #2',
    iaas: 'gcp',
    region: 'us-east1',
    version: '1.2.0',
    status: SpaceStatus.running,
    lastSeen: 0,
  } ];

  deviceUsers[0].lastConnectSpace = (({ users, ...s }) => s)(spaces[2]);
  deviceUsers[1].lastConnectSpace = (({ users, ...s }) => s)(spaces[0]);
  deviceUsers[3].lastConnectSpace = (({ users, ...s }) => s)(spaces[2]);
  deviceUsers[6].lastConnectSpace = (({ users, ...s }) => s)(spaces[2]);

  const spaceUsers: SpaceUser[] = [ {
    __typename: "SpaceUser",
    space: spaces[0],
    user: users[0],
    isOwner: true,
    isAdmin: true,
    isEgressNode: true,
    status: UserAccessStatus.active,
    bytesUploaded: '9833378',
    bytesDownloaded: '387393',
    lastConnectTime: date3.getTime(),
  }, {
    __typename: "SpaceUser",
    space: spaces[1],
    user: users[1],
    isOwner: true,
    isAdmin: true,
    isEgressNode: true,
    status: UserAccessStatus.active,
    bytesUploaded: '33939',
    bytesDownloaded: '33834',
    lastConnectTime: 1621457410097,
  }, {
    __typename: "SpaceUser",
    space: spaces[2],
    user: users[1],
    isOwner: true,
    isAdmin: true,
    isEgressNode: true,
    status: UserAccessStatus.active,
    bytesUploaded: '98333388',
    bytesDownloaded: '89333484',
    lastConnectTime: date1.getTime(),
  }, {
    __typename: "SpaceUser",
    space: spaces[1],
    user: users[0],
    isOwner: false,
    isAdmin: false,
    isEgressNode: true,
    status: UserAccessStatus.pending,
    bytesUploaded: '0',
    bytesDownloaded: '0',
    lastConnectTime: 0,
  }, {
    __typename: "SpaceUser",
    space: spaces[2],
    user: users[0],
    isOwner: false,
    isAdmin: false,
    isEgressNode: true,
    status: UserAccessStatus.active,
    bytesUploaded: '8239884',
    bytesDownloaded: '2389343',
    lastConnectTime: date3.getTime(),
  }, {
    __typename: "SpaceUser",
    space: spaces[0],
    user: users[1],
    isOwner: false,
    isAdmin: false,
    isEgressNode: true,
    status: UserAccessStatus.pending,
    bytesUploaded: '0',
    bytesDownloaded: '0',
    lastConnectTime: 0,
  }, {
    __typename: "SpaceUser",
    space: spaces[0],
    user: users[2],
    isOwner: false,
    isAdmin: false,
    isEgressNode: true,
    status: UserAccessStatus.active,
    bytesUploaded: '3388393',
    bytesDownloaded: '4857729',
    lastConnectTime: date2.getTime(),
  }, {
    __typename: "SpaceUser",
    space: spaces[2],
    user: users[2],
    isOwner: false,
    isAdmin: false,
    isEgressNode: true,
    status: UserAccessStatus.pending,
    bytesUploaded: '0',
    bytesDownloaded: '0',
    lastConnectTime: 0,
  } ];

  spaces[0].users = {
    __typename: "SpaceUsersConnection",
    totalCount: 3,
    spaceUsers: [
      spaceUsers[0],
      spaceUsers[5],
      spaceUsers[6],
    ]
  };
  spaces[1].users = {
    __typename: "SpaceUsersConnection",
    totalCount: 3,
    spaceUsers: [
      spaceUsers[1],
      spaceUsers[3],
    ]
  };
  spaces[2].users = {
    __typename: "SpaceUsersConnection",
    totalCount: 3,
    spaceUsers: [
      spaceUsers[2],
      spaceUsers[4],
      spaceUsers[7],
    ]
  };

  users[0].spaces = {
    __typename: "SpaceUsersConnection",
    totalCount: 3,
    spaceUsers: [
      spaceUsers[0],
      spaceUsers[3],
      spaceUsers[4],
    ]
  };
  users[1].spaces = {
    __typename: "SpaceUsersConnection",
    totalCount: 3,
    spaceUsers: [
      spaceUsers[1],
      spaceUsers[2],
      spaceUsers[5],
    ]
  };
  users[2].spaces = {
    __typename: "SpaceUsersConnection",
    totalCount: 3,
    spaceUsers: [
      spaceUsers[6],
      spaceUsers[7],
    ]
  };

  const apps: App[] = [ {
    __typename: "App",
    appID: '04054f43-31c4-4950-85b1-4191eedd5d5e',
    appName: 'app #1 in tom\'s space #1',
    recipe: 'app recipe #1',
    iaas: 'aws',
    region: 'us-east-1',
    version: '0.1.0',
    status: AppStatus.shutdown,
    space: spaces[0]
  }, {
    __typename: "App",
    appID: '80bc5a59-03d6-4cd8-9156-2b9e5fbbcbb2',
    appName: 'app #2 in tom\'s space #1',
    recipe: 'app recipe #2',
    iaas: 'aws',
    region: 'us-east-1',
    version: '0.2.1',
    status: AppStatus.shutdown,
    space: spaces[0]
  },  {
    __typename: "App",
    appID: '6410af20-45e4-4bca-a499-c7680b454491',
    appName: 'app #1 in bob\'s space #1',
    recipe: 'app recipe #1',
    iaas: 'aws',
    region: 'us-west-1',
    version: '0.7.5',
    status: AppStatus.running,
    space: spaces[1]
  },  {
    __typename: "App",
    appID: '9371d345-a363-4222-ba95-6840e18453ac',
    appName: 'app #2 in bob\'s space #1',
    recipe: 'app recipe #2',
    iaas: 'aws',
    region: 'us-west-1',
    version: '0.1.0',
    status: AppStatus.shutdown,
    space: spaces[1]
  },  {
    __typename: "App",
    appID: 'c715cede-091c-4a25-b003-f80123236548',
    appName: 'app #3 in bob\'s space #1',
    recipe: 'app recipe #3',
    iaas: 'aws',
    region: 'us-west-1',
    version: '0.1.5',
    status: AppStatus.shutdown,
    space: spaces[1]
  } ];

  const appUsers: AppUser[] = [ {
    __typename: "AppUser",
    app: apps[0],
    user: users[0],
    isOwner: true,
    lastAccessedTime: 0
  }, {
    __typename: "AppUser",
    app: apps[1],
    user: users[0],
    isOwner: true,
    lastAccessedTime: 0
  }, {
    __typename: "AppUser",
    app: apps[2],
    user: users[1],
    isOwner: true,
    lastAccessedTime: 0
  }, {
    __typename: "AppUser",
    app: apps[3],
    user: users[1],
    isOwner: true,
    lastAccessedTime: 0
  }, {
    __typename: "AppUser",
    app: apps[4],
    user: users[1],
    isOwner: true,
    lastAccessedTime: 0
  }, {
    __typename: "AppUser",
    app: apps[0],
    user: users[5],
    isOwner: true,
    lastAccessedTime: 0
  }, {
    __typename: "AppUser",
    app: apps[1],
    user: users[6],
    isOwner: true,
    lastAccessedTime: 0
  }, {
    __typename: "AppUser",
    app: apps[3],
    user: users[0],
    isOwner: true,
    lastAccessedTime: 0
  } ];

  users[0].apps = {
    __typename: "AppUsersConnection",
    totalCount: 2,
    appUsers: [
      appUsers[0],
      appUsers[1],
      appUsers[7]
    ]
  }
  users[1].apps = {
    __typename: "AppUsersConnection",
    totalCount: 3,
    appUsers: [
      appUsers[2],
      appUsers[3],
      appUsers[4]
    ]
  }
  users[5].apps = {
    __typename: "AppUsersConnection",
    totalCount: 1,
    appUsers: [
      appUsers[5]
    ]
  }
  users[6].apps = {
    __typename: "AppUsersConnection",
    totalCount: 1,
    appUsers: [
      appUsers[6]
    ]
  }

  apps[0].users = {
    __typename: "AppUsersConnection",
    totalCount: 2,
    appUsers: [
      appUsers[0],
      appUsers[5]
    ]
  }
  apps[1].users = {
    __typename: "AppUsersConnection",
    totalCount: 2,
    appUsers: [
      appUsers[0],
      appUsers[6]
    ]
  }
  apps[2].users = {
    __typename: "AppUsersConnection",
    totalCount: 1,
    appUsers: [
      appUsers[2]
    ]
  }
  apps[3].users = {
    __typename: "AppUsersConnection",
    totalCount: 1,
    appUsers: [
      appUsers[3],
      appUsers[7]
    ]
  }
  apps[4].users = {
    __typename: "AppUsersConnection",
    totalCount: 1,
    appUsers: [
      appUsers[4]
    ]
  }

  spaces[0].apps = {
    __typename: "SpaceAppsConnection",
    totalCount: 2,
    spaceApps: [
      apps[0],
      apps[1]
    ]
  }
  spaces[1].apps = {
    __typename: "SpaceAppsConnection",
    totalCount: 3,
    spaceApps: [
      apps[2],
      apps[3],
      apps[4]
    ]
  }

  return {
    users,
    devices, deviceUsers,
    spaces, spaceUsers,
    apps, appUsers
  };
}
