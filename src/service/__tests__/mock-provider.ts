import ProviderInterface from '../provider';

import {
  UserSearchConnection,
  UserSearchItem,
  User,
  Device,
  DeviceUser,
  UserAccessStatus,
  Space,
  SpaceUser,
  CursorInput,
  PageInfo
} from '../../model/types';

import { UserSpaceActionProps } from '../action';
import UserSpaceService from '../user-space-service';

import { 
  ActionTester,
  testActionDispatcher
} from '@appbricks/test-utils';

export const initServiceDispatch = (
  actionTester: ActionTester
): {
  dispatch: UserSpaceActionProps
  mockProvider: MockProvider
} => {

  const mockProvider = new MockProvider();
  const authService = new UserSpaceService(mockProvider)

  const dispatch = testActionDispatcher<UserSpaceActionProps>(
    'userspace',
    actionTester,
    authService.epics(),
    dispatch => {
      return UserSpaceService.dispatchProps(dispatch)
    }
  );

  return {
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

  // logged in user
  user?: User;

  constructor() {
    const { 
      users, 
      devices, deviceUsers, 
      spaces, spaceUsers 
    } = loadMockData();

    this.users = users;
    this.devices = devices;
    this.deviceUsers = deviceUsers;
    this.spaces = spaces;
    this.spaceUsers = spaceUsers;
  }

  setLoggedInUser(loggedInUser: string) {
    this.user = this.users.find(user => user.userName == loggedInUser);
    expect(this.user).toBeDefined();
  }

  async userSearch(namePrefix: string, limit?: number, cursor?: CursorInput) {

    const users = this.users
      .filter(user => user.userName!.startsWith(namePrefix))
      .map(user => 
        <UserSearchItem>{ 
          __typename: "UserSearchItem", 
          userID: user.userID, 
          userName: user.userName 
        }
      );

    let pageInfo = <PageInfo>{
      __typename: 'PageInfo',
      hasPreviousePage: false,
      hasNextPage: false,
      cursor: {
        __typename: "Cursor",
        index: -1,
        nextTokens: []
      }
    }

    let currToken = 0;
    let nextToken = users.length;

    if (limit) {
      if (cursor && cursor.index >= 0) {
        currToken = parseInt(<string>cursor!.nextTokens[cursor.index], 10);
        nextToken = currToken + limit;
        
        pageInfo.cursor!.index = cursor!.index;
        pageInfo.cursor!.nextTokens = cursor!.nextTokens;  

        pageInfo.cursor!.index++;
        if (pageInfo.cursor!.index == pageInfo.cursor!.nextTokens.length) {
          pageInfo.cursor!.nextTokens.push(nextToken.toString());        
        }
      } else {
        nextToken = limit;
        pageInfo.cursor!.index = 0;
        pageInfo.cursor!.nextTokens = [ nextToken.toString() ];
      }
      pageInfo.hasPreviousePage = (pageInfo.cursor!.index > 0);
      pageInfo.hasNextPage = nextToken < users.length;
    }

    return <UserSearchConnection>{     
      __typename: "UserSearchConnection",
      totalCount: Math.min(users.length, nextToken) - currToken,
      users: users.slice(currToken, nextToken),
      pageInfo
    }
  }

  async getUserDevices() {
    return <DeviceUser[]>this.user!.devices!.deviceUsers!
      .filter(deviceUser => deviceUser!.status == UserAccessStatus.active);
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

  async deleteDeviceUser(deviceID: string, userID: string) {
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

  async getUserSpaces() {
    return <SpaceUser[]>this.user!.spaces!.spaceUsers!
      .filter(spaceUser => spaceUser!.status == UserAccessStatus.active)
  }

  async getSpaceInvitations() {
    return <SpaceUser[]>this.user!.spaces!.spaceUsers!
      .filter(spaceUser => spaceUser!.status == UserAccessStatus.pending);
  }

  async inviteSpaceUser(spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean) {
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
      isAdmin: isAdmin,
      isEgressNode: isEgressNode,
      status: UserAccessStatus.pending,
      bytesUploaded: 0,
      bytesDownloaded: 0,
      lastConnectTime: 0,
      lastConnectDeviceID: null,
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

  async deleteSpaceUser(spaceID: string, userID: string) {
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
    return [];
  }

  async getAppInvitations() {
    return [];
  }
}

// Mock Data
function loadMockData() {

  const users: User[] = [ {
    __typename: 'User',
    userID: 'a645c56e-f454-460f-8324-eff15357e973',
    userName: 'tom',
    emailAddress: 'tom@acme.com',
    mobilePhone: '+19781112233',
    confirmed: true,
    publicKey: 'tom\'s public key',
    certificate: 'tom\'s certificate',
    certificateRequest: 'tom\'s certificate request'
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
    certificateRequest: 'bob\'s certificate request'
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
    certificateRequest: 'deb\'s certificate request'
  }, {
    __typename: 'User',
    userID: 'c18d325c-c0f1-4ba3-8898-026b48eb9bdc',
    userName: 'debbie',
    emailAddress: 'debbie@acme.com',
    mobilePhone: '+19787778899',
    confirmed: true,
    publicKey: 'debbie\'s public key',
    certificate: 'debbie\'s certificate',
    certificateRequest: 'debbie\'s certificate request'
  }, {
    __typename: 'User',
    userID: 'e745d48e-d9ba-4277-9d9e-fc13197eff38',
    userName: 'denny',
    emailAddress: 'denny@acme.com',
    mobilePhone: '+19787778899',
    confirmed: true,
    publicKey: 'denny\'s public key',
    certificate: 'denny\'s certificate',
    certificateRequest: 'denny\'s certificate request'
  }, {
    __typename: 'User',
    userID: '1ade82fc-750e-433c-aa30-4c5764ff02fb',
    userName: 'darren',
    emailAddress: 'darren@acme.com',
    mobilePhone: '+19787778899',
    confirmed: true,
    publicKey: 'darren\'s public key',
    certificate: 'darren\'s certificate',
    certificateRequest: 'darren\'s certificate request'
  }, {
    __typename: 'User',
    userID: '8e0a1535-bf9e-4548-8602-ce3b0f619734',
    userName: 'danny',
    emailAddress: 'danny@acme.com',
    mobilePhone: '+19787778899',
    confirmed: true,
    publicKey: 'danny\'s public key',
    certificate: 'danny\'s certificate',
    certificateRequest: 'danny\'s certificate request'
  } ];
  
  const devices: Device[] = [ {
    __typename: 'Device',
    deviceID: 'c5021ecb-7c69-4950-a53c-fd4d5ca73b6f',
    deviceName: 'tom\'s device #1',
    publicKey: 'tom\'s device #1 public key',
    certificate: 'tom\'s device #1 certificate key',
    certificateRequest: 'tom\'s device #1 certificate request',
  }, {
    __typename: 'Device',
    deviceID: 'ed3e2219-ff72-4405-88fb-8dab24030770',
    deviceName: 'tom\'s device #2',
    publicKey: 'tom\'s device #2 public key',
    certificate: 'tom\'s device #2 certificate key',
    certificateRequest: 'tom\'s device #2 certificate request',
  }, {
    __typename: 'Device',
    deviceID: 'f25b8176-dbb7-4a8a-b08d-5f8e56cc4303',
    deviceName: 'bob\'s device #1',
    publicKey: 'bob\'s device #1 public key',
    certificate: 'bob\'s device #1 certificate key',
    certificateRequest: 'bob\'s device #1 certificate request',
  }, {
    __typename: 'Device',
    deviceID: '9bb6399-6c7a-4cd5-a536-5a4d74482020',
    deviceName: 'bob\'s device #2',
    publicKey: 'bob\'s device #2 public key',
    certificate: 'bob\'s device #2 certificate key',
    certificateRequest: 'bob\'s device #2 certificate request',
  } ];
  
  const deviceUsers: DeviceUser[] = [ {
    __typename: "DeviceUser",
    device: devices[0],
    user: users[0],
    isOwner: true,
    status: UserAccessStatus.active,
    wireguardPublicKey: 'tom\'s device #1 wg public key',
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[1],
    user: users[0],
    isOwner: true,
    status: UserAccessStatus.active,
    wireguardPublicKey: 'tom\'s device #2 wg public key',
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[2],
    user: users[1],
    isOwner: true,
    status: UserAccessStatus.active,
    wireguardPublicKey: 'bob\'s device #1 wg public key',
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[2],
    user: users[0],
    isOwner: false,
    status: UserAccessStatus.active,
    wireguardPublicKey: 'tom\'s wg public key for bob\'s device #1',
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[1],
    user: users[1],
    isOwner: false,
    status: UserAccessStatus.pending,
    wireguardPublicKey: 'bob\'s wg public key for tom\'s device #2',
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[0],
    user: users[2],
    isOwner: false,
    status: UserAccessStatus.pending,
    wireguardPublicKey: 'deb\'s wg public key for tom\'s device #1',
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastAccessTime: 1622655379768,
  }, {
    __typename: "DeviceUser",
    device: devices[1],
    user: users[2],
    isOwner: false,
    status: UserAccessStatus.active,
    wireguardPublicKey: 'deb\'s wg public key for tom\'s device #2',
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[2],
    user: users[2],
    isOwner: false,
    status: UserAccessStatus.pending,
    wireguardPublicKey: 'deb\'s wg public key for bob\'s device #1',
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[3],
    user: users[1],
    isOwner: true,
    status: UserAccessStatus.active,
    wireguardPublicKey: 'bob\'s device #2 wg public key',
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[3],
    user: users[0],
    isOwner: false,
    status: UserAccessStatus.pending,
    wireguardPublicKey: 'tom\'s wg public key for bob\'s device #2',
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastAccessTime: 0,
  }, {
    __typename: "DeviceUser",
    device: devices[3],
    user: users[2],
    isOwner: false,
    status: UserAccessStatus.pending,
    wireguardPublicKey: 'deb\'s wg public key for bob\'s device #2',
    bytesUploaded: 0,
    bytesDownloaded: 0,
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
  }
  users[1].devices = {
    __typename: "DeviceUsersConnection",
    totalCount: 3,
    deviceUsers: [
      deviceUsers[2],
      deviceUsers[4],
      deviceUsers[8],
    ]
  }
  users[2].devices = {
    __typename: "DeviceUsersConnection",
    totalCount: 4,
    deviceUsers: [
      deviceUsers[5],
      deviceUsers[6],
      deviceUsers[7],
      deviceUsers[10],
    ]
  }
  
  const spaces: Space[] = [ {
    __typename: "Space",
    spaceID: 'd83b7d95-5681-427d-a65a-5d8a868d72e9',
    spaceName: 'tom\'s space #1',
    recipe: 'recipe #1',
    iaas: 'aws',
    region: 'us-east-1',
    lastSeen: 0,
  }, {
    __typename: "Space",
    spaceID: 'af296bd0-1186-42f0-b7ca-90980d22b961',
    spaceName: 'bob\'s space #1',
    recipe: 'recipe #1',
    iaas: 'aws',
    region: 'us-west-1',
    lastSeen: 0,
  }, {
    __typename: "Space",
    spaceID: '9a5242dc-0681-4d67-9fe7-bdc691d1a18d',
    spaceName: 'bob\'s space #2',
    recipe: 'recipe #2',
    iaas: 'gcp',
    region: 'us-east1',
    lastSeen: 0,
  } ];
  
  const spaceUsers: SpaceUser[] = [ {
    __typename: "SpaceUser",
    space: spaces[0],
    user: users[0],
    isOwner: true,
    isAdmin: true,
    isEgressNode: true,
    status: UserAccessStatus.active,
    bytesUploaded: 9833378,
    bytesDownloaded: 387393,
    lastConnectTime: 1621457397783,
    lastConnectDeviceID: null,
  }, {
    __typename: "SpaceUser",
    space: spaces[1],
    user: users[1],
    isOwner: true,
    isAdmin: true,
    isEgressNode: true,
    status: UserAccessStatus.active,
    bytesUploaded: 33939,
    bytesDownloaded: 33834,
    lastConnectTime: 1621457410097,
    lastConnectDeviceID: null,
  }, {
    __typename: "SpaceUser",
    space: spaces[2],
    user: users[1],
    isOwner: true,
    isAdmin: true,
    isEgressNode: true,
    status: UserAccessStatus.active,
    bytesUploaded: 98333388,
    bytesDownloaded: 89333484,
    lastConnectTime: 1621457266813,
    lastConnectDeviceID: null,
  }, {
    __typename: "SpaceUser",
    space: spaces[1],
    user: users[0],
    isOwner: false,
    isAdmin: false,
    isEgressNode: true,
    status: UserAccessStatus.pending,
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastConnectTime: 0,
    lastConnectDeviceID: null,
  }, {
    __typename: "SpaceUser",
    space: spaces[2],
    user: users[0],
    isOwner: false,
    isAdmin: false,
    isEgressNode: true,
    status: UserAccessStatus.active,
    bytesUploaded: 8239884,
    bytesDownloaded: 2389343,
    lastConnectTime: 1621457740350,
    lastConnectDeviceID: null,
  }, {
    __typename: "SpaceUser",
    space: spaces[0],
    user: users[1],
    isOwner: false,
    isAdmin: false,
    isEgressNode: true,
    status: UserAccessStatus.pending,
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastConnectTime: 0,
    lastConnectDeviceID: null,
  }, {
    __typename: "SpaceUser",
    space: spaces[0],
    user: users[2],
    isOwner: false,
    isAdmin: false,
    isEgressNode: true,
    status: UserAccessStatus.active,
    bytesUploaded: 3388393,
    bytesDownloaded: 4857729,
    lastConnectTime: 1621457598241,
    lastConnectDeviceID: null,
  }, {
    __typename: "SpaceUser",
    space: spaces[2],
    user: users[2],
    isOwner: false,
    isAdmin: false,
    isEgressNode: true,
    status: UserAccessStatus.pending,
    bytesUploaded: 0,
    bytesDownloaded: 0,
    lastConnectTime: 0,
    lastConnectDeviceID: null,
  } ]
  
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

  return { 
    users, 
    devices, deviceUsers, 
    spaces, spaceUsers 
  };
}
