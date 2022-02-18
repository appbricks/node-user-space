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
  accessStatus: UserAccessStatus
  type: string
  version: string
  ownerAdmin: string
  lastAccessed: string
  lastAccessedBy: string
  lastSpaceConnectedTo: string
  dataUsageIn: string
  dataUsageOut: string

  settings: DisplayType

  isOwned: boolean
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
  accessStatus: UserAccessStatus
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

  spaceDefaults: SpaceDefaults

  isOwned: boolean
  bytesDownloaded: number
  bytesUploaded: number

  users: SpaceUserListItem[]
}

export interface SpaceDefaults extends DisplayType {
  isEgressNode: boolean
}

export interface SpaceUserListItem extends DisplayType {
  userID: string
  userName: string
  fullName: string
  status: UserAccessStatus,
  egressAllowed: string
  dataUsageIn: string
  dataUsageOut: string
  lastConnectTime: string
  lastDeviceConnected: string

  spaceUser?: SpaceUser
}
