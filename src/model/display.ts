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

  updatedFields?: string[]
}

export interface DeviceDetail extends DisplayType {
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
  name: string
  status: SpaceStatus
  ownerAdmin: string
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

  spaceUser?: SpaceUser
}

/**
 * Given two display type instance the changed non-object
 * fields will be determined and added to the display type's
 * updated field list.
 * 
 * @param orig     the original unchanged display type instance
 * @param updated  the changed display type instance whose updatedFields
 *                 array will contain the change fields
 */
export function setUpdatedFields<T extends DisplayType>(orig: T, updated: T) {
  updated.updatedFields = [];
  for (const [key, value] of Object.entries(orig)) {
    if (typeof value != "object" && typeof value != "function") {
      const o = <{[key: string]: any}>updated;
      if (value != o[key]) {
        updated.updatedFields.push(key);
      }
    }
  }
}
