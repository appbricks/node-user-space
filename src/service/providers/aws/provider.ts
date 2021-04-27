import ProviderInterface from '../../provider';

import {
  UserSearchConnection,
  Device,
  DeviceUser,
  SpaceUser,
  Space
} from '../../../model/types';

/**
 * AWS AppSync User-Space API provider. 
 */
export default class Provider implements ProviderInterface {

  userSearch(namePrefix: string) {
    return <UserSearchConnection>{     
      __typename: "UserSearchConnection" 
    }
  }

  getUserDevices() {
    return [];
  }

  getDeviceAccessRequests(deviceID: string) {
    return []
  }

  activateDeviceUser(deviceID: string, userID: string) {
    return <DeviceUser>{
      __typename: "DeviceUser"
    };
  }

  deleteDeviceUser(deviceID: string, userID: string) {
    return <DeviceUser>{
      __typename: "DeviceUser"
    };
  }

  deleteDevice(deviceID: string) {
    return <Device>{
      __typename: "Device"
    };
  }

  getUserSpaces() {
    return [];
  }

  inviteSpaceUser(spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean) {
    return <SpaceUser>{
      __typename: "SpaceUser"
    };
  }

  deactivateSpaceUser(spaceID: string, userID: string) {
    return <SpaceUser>{
      __typename: "SpaceUser"
    };
  }

  deleteSpaceUser(spaceID: string, userID: string) {
    return <SpaceUser>{
      __typename: "SpaceUser"
    };
  }

  deleteSpace(spaceID: string) {
    return <Space>{
      __typename: "Space"
    }
  }

  getSpaceInvitations() {
    return []
  }

  acceptSpaceUserInvitation(spaceID: string) {
    return <SpaceUser>{
      __typename: "SpaceUser"
    };
  }
  
  leaveSpaceUser(spaceID: string) {
    return <SpaceUser>{
      __typename: "SpaceUser"
    };
  }

  getUserApps() {
    return [];
  }

  getAppInvitations() {
    return [];
  }
}
