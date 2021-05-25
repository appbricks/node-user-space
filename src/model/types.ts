/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Key = {
  publicKey?: string | null,
  certificateRequest?: string | null,
};

export type User = {
  __typename: "User",
  userID?: string,
  userName?: string,
  emailAddress?: string | null,
  mobilePhone?: string | null,
  confirmed?: boolean | null,
  publicKey?: string | null,
  certificate?: string | null,
  certificateRequest?: string | null,
  devices?: DeviceUsersConnection,
  spaces?: SpaceUsersConnection,
  // A user's universal config is an encrypted
  // document containing metadata of all spaces the
  // user owns.
  universalConfig?: string | null,
};

export type DeviceUsersConnection = {
  __typename: "DeviceUsersConnection",
  pageInfo?: PageInfo,
  edges?:  Array<DeviceUsersEdge | null > | null,
  totalCount?: number | null,
  deviceUsers?:  Array<DeviceUser | null > | null,
};

export type PageInfo = {
  __typename: "PageInfo",
  // When paginating forwards, are there more items?
  hasNextPage?: boolean,
  // When paginating backwards, are there more items?
  hasPreviousePage?: boolean,
  // Cursor used for pagination
  cursor?: Cursor,
};

export type Cursor = {
  __typename: "Cursor",
  // The next page token index. To move to the next
  // page, cursor does not need to be updated. To move
  // to the prev page simply decrement the index by 2.
  index?: number,
  // The token to use to retrieve the next page for a
  // given index
  nextTokens?: Array< string | null >,
};

export type DeviceUsersEdge = {
  __typename: "DeviceUsersEdge",
  node?: DeviceUser,
};

export type DeviceUser = {
  __typename: "DeviceUser",
  device?: Device,
  user?: User,
  isOwner?: boolean | null,
  status?: UserAccessStatus | null,
  wireguardPublicKey?: string | null,
  bytesUploaded?: number | null,
  bytesDownloaded?: number | null,
  lastConnectTime?: number | null,
};

export type Device = {
  __typename: "Device",
  deviceID?: string,
  deviceName?: string,
  publicKey?: string | null,
  certificate?: string | null,
  certificateRequest?: string | null,
  users?: DeviceUsersConnection,
};

export enum UserAccessStatus {
  pending = "pending",
  active = "active",
  inactive = "inactive",
}


export type SpaceUsersConnection = {
  __typename: "SpaceUsersConnection",
  pageInfo?: PageInfo,
  edges?:  Array<SpaceUsersEdge | null > | null,
  totalCount?: number | null,
  spaceUsers?:  Array<SpaceUser | null > | null,
};

export type SpaceUsersEdge = {
  __typename: "SpaceUsersEdge",
  node?: SpaceUser,
};

export type SpaceUser = {
  __typename: "SpaceUser",
  space?: Space,
  user?: User,
  isOwner?: boolean | null,
  isAdmin?: boolean | null,
  // User's that are neither owners or admin can
  // connect to the space and access only apps
  // they are allowed to access. If this flag
  // is set then they can also use the space
  // as the egress node for internet access.
  isEgressNode?: boolean | null,
  status?: UserAccessStatus | null,
  bytesUploaded?: number | null,
  bytesDownloaded?: number | null,
  accessList?: AppUsersConnection,
  lastConnectTime?: number | null,
  lastConnectDeviceID?: string | null,
};

export type Space = {
  __typename: "Space",
  spaceID?: string,
  spaceName?: string,
  recipe?: string | null,
  iaas?: string | null,
  region?: string | null,
  apps?: SpaceAppsConnection,
  users?: SpaceUsersConnection,
  status?: SpaceStatus | null,
  lastSeen?: number | null,
};

export type SpaceAppsConnection = {
  __typename: "SpaceAppsConnection",
  pageInfo?: PageInfo,
  edges?:  Array<SpaceAppsEdge | null > | null,
  totalCount?: number | null,
  spaceApps?:  Array<App | null > | null,
};

export type SpaceAppsEdge = {
  __typename: "SpaceAppsEdge",
  node?: App,
};

export type App = {
  __typename: "App",
  appID?: string,
  appName?: string,
  recipe?: string,
  iaas?: string,
  region?: string,
  space?: Space,
  users?: AppUsersConnection,
};

export type AppUsersConnection = {
  __typename: "AppUsersConnection",
  pageInfo?: PageInfo,
  edges?:  Array<AppUsersEdge | null > | null,
  totalCount?: number | null,
  appUsers?:  Array<AppUser | null > | null,
};

export type AppUsersEdge = {
  __typename: "AppUsersEdge",
  node?: AppUser,
};

export type AppUser = {
  __typename: "AppUser",
  app?: App,
  user?: User,
  lastAccessTime?: number | null,
};

export enum SpaceStatus {
  undeployed = "undeployed",
  running = "running",
  shutdown = "shutdown",
  pending = "pending",
  unknown = "unknown",
}


export type WireguardKey = {
  wireguardPublicKey?: string | null,
};

export type DeviceII = {
  __typename: "DeviceII",
  idKey?: string,
  deviceUser?: DeviceUser,
};

export type SpaceII = {
  __typename: "SpaceII",
  idKey?: string,
  spaceUser?: SpaceUser,
};

export type TableUsersFilterInput = {
  userName?: TableStringFilterInput | null,
  emailAddress?: TableStringFilterInput | null,
  mobilePhone?: TableStringFilterInput | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type CursorInput = {
  index: number,
  nextTokens: Array< string | null >,
};

export type UserSearchConnection = {
  __typename: "UserSearchConnection",
  pageInfo?: PageInfo,
  edges?:  Array<UserSearchEdge | null > | null,
  totalCount?: number | null,
  users?:  Array<UserSearchItem | null > | null,
};

export type UserSearchEdge = {
  __typename: "UserSearchEdge",
  node?: UserSearchItem,
};

export type UserSearchItem = {
  __typename: "UserSearchItem",
  userID?: string,
  userName?: string,
};

export type UpdateUserKeyMutationVariables = {
  userKey?: Key,
};

export type UpdateUserKeyMutation = {
  // Update the logged in user's key
  updateUserKey?:  {
    __typename: "User",
    userID: string,
    userName: string,
    emailAddress?: string | null,
    mobilePhone?: string | null,
    confirmed?: boolean | null,
    publicKey?: string | null,
    certificate?: string | null,
    certificateRequest?: string | null,
    devices?:  {
      __typename: "DeviceUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      deviceUsers?:  Array< {
        __typename: "DeviceUser",
        isOwner?: boolean | null,
        status?: UserAccessStatus | null,
        wireguardPublicKey?: string | null,
        bytesUploaded?: number | null,
        bytesDownloaded?: number | null,
        lastConnectTime?: number | null,
      } | null > | null,
    } | null,
    spaces?:  {
      __typename: "SpaceUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      spaceUsers?:  Array< {
        __typename: "SpaceUser",
        isOwner?: boolean | null,
        isAdmin?: boolean | null,
        // User's that are neither owners or admin can
        // connect to the space and access only apps
        // they are allowed to access. If this flag
        // is set then they can also use the space
        // as the egress node for internet access.
        isEgressNode?: boolean | null,
        status?: UserAccessStatus | null,
        bytesUploaded?: number | null,
        bytesDownloaded?: number | null,
        lastConnectTime?: number | null,
        lastConnectDeviceID?: string | null,
      } | null > | null,
    } | null,
    // A user's universal config is an encrypted
    // document containing metadata of all spaces the
    // user owns.
    universalConfig?: string | null,
  } | null,
};

export type AddDeviceMutationVariables = {
  deviceName?: string,
  deviceKey?: Key,
  accessKey?: WireguardKey,
};

export type AddDeviceMutation = {
  // Add a new device for the logged in user
  addDevice?:  {
    __typename: "DeviceII",
    idKey: string,
    deviceUser:  {
      __typename: "DeviceUser",
      device?:  {
        __typename: "Device",
        deviceID: string,
        deviceName: string,
        publicKey?: string | null,
        certificate?: string | null,
        certificateRequest?: string | null,
      } | null,
      user?:  {
        __typename: "User",
        userID: string,
        userName: string,
        emailAddress?: string | null,
        mobilePhone?: string | null,
        confirmed?: boolean | null,
        publicKey?: string | null,
        certificate?: string | null,
        certificateRequest?: string | null,
        // A user's universal config is an encrypted
        // document containing metadata of all spaces the
        // user owns.
        universalConfig?: string | null,
      } | null,
      isOwner?: boolean | null,
      status?: UserAccessStatus | null,
      wireguardPublicKey?: string | null,
      bytesUploaded?: number | null,
      bytesDownloaded?: number | null,
      lastConnectTime?: number | null,
    },
  } | null,
};

export type AddDeviceUserMutationVariables = {
  deviceID?: string,
  accessKey?: WireguardKey,
};

export type AddDeviceUserMutation = {
  // Add logged in user to the given device
  addDeviceUser?:  {
    __typename: "DeviceUser",
    device?:  {
      __typename: "Device",
      deviceID: string,
      deviceName: string,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    status?: UserAccessStatus | null,
    wireguardPublicKey?: string | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    lastConnectTime?: number | null,
  } | null,
};

export type ActivateDeviceUserMutationVariables = {
  deviceID?: string,
  userID?: string,
};

export type ActivateDeviceUserMutation = {
  // Activate a users access to a device
  activateDeviceUser?:  {
    __typename: "DeviceUser",
    device?:  {
      __typename: "Device",
      deviceID: string,
      deviceName: string,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    status?: UserAccessStatus | null,
    wireguardPublicKey?: string | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    lastConnectTime?: number | null,
  } | null,
};

export type UpdateDeviceKeyMutationVariables = {
  deviceID?: string,
  deviceKey?: Key,
};

export type UpdateDeviceKeyMutation = {
  // Update the keys for an owned device
  updateDeviceKey?:  {
    __typename: "Device",
    deviceID: string,
    deviceName: string,
    publicKey?: string | null,
    certificate?: string | null,
    certificateRequest?: string | null,
    users?:  {
      __typename: "DeviceUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      deviceUsers?:  Array< {
        __typename: "DeviceUser",
        isOwner?: boolean | null,
        status?: UserAccessStatus | null,
        wireguardPublicKey?: string | null,
        bytesUploaded?: number | null,
        bytesDownloaded?: number | null,
        lastConnectTime?: number | null,
      } | null > | null,
    } | null,
  } | null,
};

export type UpdateDeviceUserKeyMutationVariables = {
  deviceID?: string,
  userID?: string | null,
  accessKey?: WireguardKey,
};

export type UpdateDeviceUserKeyMutation = {
  // Update the logged in user's wireguard key for
  // the device. If the logged in user is the
  // device owner then he/she can update the keys.
  updateDeviceUserKey?:  {
    __typename: "DeviceUser",
    device?:  {
      __typename: "Device",
      deviceID: string,
      deviceName: string,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    status?: UserAccessStatus | null,
    wireguardPublicKey?: string | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    lastConnectTime?: number | null,
  } | null,
};

export type DeleteDeviceUserMutationVariables = {
  deviceID?: string,
  userID?: string | null,
};

export type DeleteDeviceUserMutation = {
  // Remove the logged in user from the device. If
  // the logged in user is the device owner then
  // he/she can remove the given user from the
  // device.
  deleteDeviceUser?:  {
    __typename: "DeviceUser",
    device?:  {
      __typename: "Device",
      deviceID: string,
      deviceName: string,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    status?: UserAccessStatus | null,
    wireguardPublicKey?: string | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    lastConnectTime?: number | null,
  } | null,
};

export type DeleteDeviceMutationVariables = {
  deviceID?: string,
};

export type DeleteDeviceMutation = {
  // Delete an owned device. Returns userIDs of
  // all associated users deleted as a result.
  deleteDevice?: Array< string | null > | null,
};

export type AddSpaceMutationVariables = {
  spaceName?: string,
  recipe?: string,
  iaas?: string,
  region?: string,
  isEgressNode?: boolean,
};

export type AddSpaceMutation = {
  // Add new space for the logged in user
  addSpace?:  {
    __typename: "SpaceII",
    idKey: string,
    spaceUser:  {
      __typename: "SpaceUser",
      space?:  {
        __typename: "Space",
        spaceID: string,
        spaceName: string,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
      user?:  {
        __typename: "User",
        userID: string,
        userName: string,
        emailAddress?: string | null,
        mobilePhone?: string | null,
        confirmed?: boolean | null,
        publicKey?: string | null,
        certificate?: string | null,
        certificateRequest?: string | null,
        // A user's universal config is an encrypted
        // document containing metadata of all spaces the
        // user owns.
        universalConfig?: string | null,
      } | null,
      isOwner?: boolean | null,
      isAdmin?: boolean | null,
      // User's that are neither owners or admin can
      // connect to the space and access only apps
      // they are allowed to access. If this flag
      // is set then they can also use the space
      // as the egress node for internet access.
      isEgressNode?: boolean | null,
      status?: UserAccessStatus | null,
      bytesUploaded?: number | null,
      bytesDownloaded?: number | null,
      accessList?:  {
        __typename: "AppUsersConnection",
        totalCount?: number | null,
      } | null,
      lastConnectTime?: number | null,
      lastConnectDeviceID?: string | null,
    },
  } | null,
};

export type InviteSpaceUserMutationVariables = {
  spaceID?: string,
  userID?: string,
  isAdmin?: boolean,
  isEgressNode?: boolean,
};

export type InviteSpaceUserMutation = {
  // Invite a user to connect and use space services
  inviteSpaceUser?:  {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName: string,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      apps?:  {
        __typename: "SpaceAppsConnection",
        totalCount?: number | null,
      } | null,
      users?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      status?: SpaceStatus | null,
      lastSeen?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    isAdmin?: boolean | null,
    // User's that are neither owners or admin can
    // connect to the space and access only apps
    // they are allowed to access. If this flag
    // is set then they can also use the space
    // as the egress node for internet access.
    isEgressNode?: boolean | null,
    status?: UserAccessStatus | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    accessList?:  {
      __typename: "AppUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      appUsers?:  Array< {
        __typename: "AppUser",
        lastAccessTime?: number | null,
      } | null > | null,
    } | null,
    lastConnectTime?: number | null,
    lastConnectDeviceID?: string | null,
  } | null,
};

export type ActivateSpaceUserMutationVariables = {
  spaceID?: string,
  userID?: string,
};

export type ActivateSpaceUserMutation = {
  // Activates a space user in the space owned
  // by the logged in user
  activateSpaceUser?:  {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName: string,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      apps?:  {
        __typename: "SpaceAppsConnection",
        totalCount?: number | null,
      } | null,
      users?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      status?: SpaceStatus | null,
      lastSeen?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    isAdmin?: boolean | null,
    // User's that are neither owners or admin can
    // connect to the space and access only apps
    // they are allowed to access. If this flag
    // is set then they can also use the space
    // as the egress node for internet access.
    isEgressNode?: boolean | null,
    status?: UserAccessStatus | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    accessList?:  {
      __typename: "AppUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      appUsers?:  Array< {
        __typename: "AppUser",
        lastAccessTime?: number | null,
      } | null > | null,
    } | null,
    lastConnectTime?: number | null,
    lastConnectDeviceID?: string | null,
  } | null,
};

export type DeactivateSpaceUserMutationVariables = {
  spaceID?: string,
  userID?: string,
};

export type DeactivateSpaceUserMutation = {
  // Deactivates a space user from the space owned
  // by the logged in user
  deactivateSpaceUser?:  {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName: string,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      apps?:  {
        __typename: "SpaceAppsConnection",
        totalCount?: number | null,
      } | null,
      users?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      status?: SpaceStatus | null,
      lastSeen?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    isAdmin?: boolean | null,
    // User's that are neither owners or admin can
    // connect to the space and access only apps
    // they are allowed to access. If this flag
    // is set then they can also use the space
    // as the egress node for internet access.
    isEgressNode?: boolean | null,
    status?: UserAccessStatus | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    accessList?:  {
      __typename: "AppUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      appUsers?:  Array< {
        __typename: "AppUser",
        lastAccessTime?: number | null,
      } | null > | null,
    } | null,
    lastConnectTime?: number | null,
    lastConnectDeviceID?: string | null,
  } | null,
};

export type DeleteSpaceUserMutationVariables = {
  spaceID?: string,
  userID?: string,
};

export type DeleteSpaceUserMutation = {
  // Delete a space user from the space owned by
  // the logged in user
  deleteSpaceUser?:  {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName: string,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      apps?:  {
        __typename: "SpaceAppsConnection",
        totalCount?: number | null,
      } | null,
      users?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      status?: SpaceStatus | null,
      lastSeen?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    isAdmin?: boolean | null,
    // User's that are neither owners or admin can
    // connect to the space and access only apps
    // they are allowed to access. If this flag
    // is set then they can also use the space
    // as the egress node for internet access.
    isEgressNode?: boolean | null,
    status?: UserAccessStatus | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    accessList?:  {
      __typename: "AppUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      appUsers?:  Array< {
        __typename: "AppUser",
        lastAccessTime?: number | null,
      } | null > | null,
    } | null,
    lastConnectTime?: number | null,
    lastConnectDeviceID?: string | null,
  } | null,
};

export type DeleteSpaceMutationVariables = {
  spaceID?: string,
};

export type DeleteSpaceMutation = {
  // Deletes an owned space. Returns userIDs of
  // all associated users deleted as a result.
  deleteSpace?: Array< string | null > | null,
};

export type AcceptSpaceUserInvitationMutationVariables = {
  spaceID?: string,
};

export type AcceptSpaceUserInvitationMutation = {
  // Accept the invitation for the logged in user
  // to connect and use space services
  acceptSpaceUserInvitation?:  {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName: string,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      apps?:  {
        __typename: "SpaceAppsConnection",
        totalCount?: number | null,
      } | null,
      users?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      status?: SpaceStatus | null,
      lastSeen?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    isAdmin?: boolean | null,
    // User's that are neither owners or admin can
    // connect to the space and access only apps
    // they are allowed to access. If this flag
    // is set then they can also use the space
    // as the egress node for internet access.
    isEgressNode?: boolean | null,
    status?: UserAccessStatus | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    accessList?:  {
      __typename: "AppUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      appUsers?:  Array< {
        __typename: "AppUser",
        lastAccessTime?: number | null,
      } | null > | null,
    } | null,
    lastConnectTime?: number | null,
    lastConnectDeviceID?: string | null,
  } | null,
};

export type LeaveSpaceUserMutationVariables = {
  spaceID?: string,
};

export type LeaveSpaceUserMutation = {
  // Deactivates the current logged in user's
  // access to the given space
  leaveSpaceUser?:  {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName: string,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      apps?:  {
        __typename: "SpaceAppsConnection",
        totalCount?: number | null,
      } | null,
      users?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      status?: SpaceStatus | null,
      lastSeen?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    isAdmin?: boolean | null,
    // User's that are neither owners or admin can
    // connect to the space and access only apps
    // they are allowed to access. If this flag
    // is set then they can also use the space
    // as the egress node for internet access.
    isEgressNode?: boolean | null,
    status?: UserAccessStatus | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    accessList?:  {
      __typename: "AppUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      appUsers?:  Array< {
        __typename: "AppUser",
        lastAccessTime?: number | null,
      } | null > | null,
    } | null,
    lastConnectTime?: number | null,
    lastConnectDeviceID?: string | null,
  } | null,
};

export type UserSearchQueryVariables = {
  filter?: TableUsersFilterInput,
  limit?: number | null,
  next?: CursorInput | null,
};

export type UserSearchQuery = {
  // Returns a list of users matching
  // the given filter
  userSearch?:  {
    __typename: "UserSearchConnection",
    pageInfo:  {
      __typename: "PageInfo",
      // When paginating forwards, are there more items?
      hasNextPage: boolean,
      // When paginating backwards, are there more items?
      hasPreviousePage: boolean,
      // Cursor used for pagination
      cursor?:  {
        __typename: "Cursor",
        // The next page token index. To move to the next
        // page, cursor does not need to be updated. To move
        // to the prev page simply decrement the index by 2.
        index: number,
        // The token to use to retrieve the next page for a
        // given index
        nextTokens: Array< string | null >,
      } | null,
    },
    edges?:  Array< {
      __typename: "UserSearchEdge",
      node:  {
        __typename: "UserSearchItem",
        userID: string,
        userName: string,
      },
    } | null > | null,
    totalCount?: number | null,
    users?:  Array< {
      __typename: "UserSearchItem",
      userID: string,
      userName: string,
    } | null > | null,
  } | null,
};

export type GetUserQuery = {
  // Return the logged in user
  getUser?:  {
    __typename: "User",
    userID: string,
    userName: string,
    emailAddress?: string | null,
    mobilePhone?: string | null,
    confirmed?: boolean | null,
    publicKey?: string | null,
    certificate?: string | null,
    certificateRequest?: string | null,
    devices?:  {
      __typename: "DeviceUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      deviceUsers?:  Array< {
        __typename: "DeviceUser",
        isOwner?: boolean | null,
        status?: UserAccessStatus | null,
        wireguardPublicKey?: string | null,
        bytesUploaded?: number | null,
        bytesDownloaded?: number | null,
        lastConnectTime?: number | null,
      } | null > | null,
    } | null,
    spaces?:  {
      __typename: "SpaceUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      spaceUsers?:  Array< {
        __typename: "SpaceUser",
        isOwner?: boolean | null,
        isAdmin?: boolean | null,
        // User's that are neither owners or admin can
        // connect to the space and access only apps
        // they are allowed to access. If this flag
        // is set then they can also use the space
        // as the egress node for internet access.
        isEgressNode?: boolean | null,
        status?: UserAccessStatus | null,
        bytesUploaded?: number | null,
        bytesDownloaded?: number | null,
        lastConnectTime?: number | null,
        lastConnectDeviceID?: string | null,
      } | null > | null,
    } | null,
    // A user's universal config is an encrypted
    // document containing metadata of all spaces the
    // user owns.
    universalConfig?: string | null,
  } | null,
};

export type GetDeviceQueryVariables = {
  deviceID?: string,
};

export type GetDeviceQuery = {
  // Gets a device associated with the
  // logged in user
  getDevice?:  {
    __typename: "DeviceUser",
    device?:  {
      __typename: "Device",
      deviceID: string,
      deviceName: string,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    status?: UserAccessStatus | null,
    wireguardPublicKey?: string | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    lastConnectTime?: number | null,
  } | null,
};

export type GetSpaceQueryVariables = {
  spaceID?: string,
};

export type GetSpaceQuery = {
  // Gets a space associated with the
  // logged in user
  getSpace?:  {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName: string,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      apps?:  {
        __typename: "SpaceAppsConnection",
        totalCount?: number | null,
      } | null,
      users?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      status?: SpaceStatus | null,
      lastSeen?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    isAdmin?: boolean | null,
    // User's that are neither owners or admin can
    // connect to the space and access only apps
    // they are allowed to access. If this flag
    // is set then they can also use the space
    // as the egress node for internet access.
    isEgressNode?: boolean | null,
    status?: UserAccessStatus | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    accessList?:  {
      __typename: "AppUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      appUsers?:  Array< {
        __typename: "AppUser",
        lastAccessTime?: number | null,
      } | null > | null,
    } | null,
    lastConnectTime?: number | null,
    lastConnectDeviceID?: string | null,
  } | null,
};

export type GetDeviceAccessRequestsQueryVariables = {
  deviceID?: string,
};

export type GetDeviceAccessRequestsQuery = {
  // Gets all device access requests for
  // devices owned by the logged in User
  getDeviceAccessRequests?:  Array< {
    __typename: "DeviceUser",
    device?:  {
      __typename: "Device",
      deviceID: string,
      deviceName: string,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    status?: UserAccessStatus | null,
    wireguardPublicKey?: string | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    lastConnectTime?: number | null,
  } | null > | null,
};

export type GetSpaceInvitationsQuery = {
  // Gets all space invitations recieved
  // by the logged in User
  getSpaceInvitations?:  Array< {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName: string,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      apps?:  {
        __typename: "SpaceAppsConnection",
        totalCount?: number | null,
      } | null,
      users?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      status?: SpaceStatus | null,
      lastSeen?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
      certificateRequest?: string | null,
      devices?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
      spaces?:  {
        __typename: "SpaceUsersConnection",
        totalCount?: number | null,
      } | null,
      // A user's universal config is an encrypted
      // document containing metadata of all spaces the
      // user owns.
      universalConfig?: string | null,
    } | null,
    isOwner?: boolean | null,
    isAdmin?: boolean | null,
    // User's that are neither owners or admin can
    // connect to the space and access only apps
    // they are allowed to access. If this flag
    // is set then they can also use the space
    // as the egress node for internet access.
    isEgressNode?: boolean | null,
    status?: UserAccessStatus | null,
    bytesUploaded?: number | null,
    bytesDownloaded?: number | null,
    accessList?:  {
      __typename: "AppUsersConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      appUsers?:  Array< {
        __typename: "AppUser",
        lastAccessTime?: number | null,
      } | null > | null,
    } | null,
    lastConnectTime?: number | null,
    lastConnectDeviceID?: string | null,
  } | null > | null,
};
