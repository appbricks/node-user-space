import {
  DeviceUser,
  SpaceUser,
  SpaceStatus,
  UserAccessStatus
} from './types';

/**
 * User space presentation types
 */

export interface DisplayType {
  // allow instances of display type 
  // to be accessed like a dictionary
  [key: string]: any;
}

export interface DeviceDetail extends DisplayType {
  deviceID: string
  name: string
  type: string
  version: string
  ownerAdmin: string
  lastAccessed: string
  lastAccessedBy: string
  lastSpaceConnectedTo: string
  dataUsageIn: string
  dataUsageOut: string

  bytesDownloaded: number
  bytesUploaded: number
  lastAccessedTime: number

  users: DeviceUserListItem[]
}

export interface DeviceUserListItem extends DisplayType {
  userID: string
  userName: string
  fullName: string
  status: UserAccessStatus
  dataUsageIn: string
  dataUsageOut: string
  lastAccessTime: string
  lastSpaceConnectedTo?: string

  deviceUser?: DeviceUser
}

export interface SpaceDetail extends DisplayType {
  spaceID: string
  name: string
  status: SpaceStatus
  ownerAdmin: string
  lastSeen: string
  clientsConnected: number
  dataUsageIn: string
  dataUsageOut: string
  cloudProvider: string
  type: string
  location: string
  version: string

  bytesDownloaded: number
  bytesUploaded: number

  users: SpaceUserListItem[]
}

export interface SpaceUserListItem extends DisplayType {
  userID: string
  userName: string
  fullName: string
  status: UserAccessStatus,
  dataUsageIn: string
  dataUsageOut: string
  lastConnectTime: string
  lastDeviceConnected: string

  spaceUser?: SpaceUser
}
