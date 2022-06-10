/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Key = {
  publicKey: string,
  // key timestamp
  keyTimestamp?: string | null,
  // certificate request used to
  // request a signed certificate
  // for the key owner
  certificateRequest?: string | null,
};

export type User = {
  __typename: "User",
  userID?: string,
  userName?: string,
  firstName?: string | null,
  middleName?: string | null,
  familyName?: string | null,
  preferredName?: string | null,
  emailAddress?: string | null,
  mobilePhone?: string | null,
  confirmed?: boolean | null,
  publicKey?: string | null,
  certificate?: string | null,
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
  bytesUploaded?: string | null,
  bytesDownloaded?: string | null,
  lastAccessTime?: number | null,
  lastConnectSpace?: Space,
};

export type Device = {
  __typename: "Device",
  deviceID?: string,
  deviceName?: string | null,
  owner?: UserRef,
  // device info
  deviceType?: string | null,
  clientVersion?: string | null,
  publicKey?: string | null,
  certificate?: string | null,
  // common configuration associated
  // with the device such as default
  // settings for new device users
  settings?: string | null,
  // ID of managing device if this
  // is a managed device. '-' if not.
  managedBy?: string | null,
  // managed devices
  managedDevices?:  Array<Device | null > | null,
  users?: DeviceUsersConnection,
};

export type UserRef = {
  __typename: "UserRef",
  userID?: string,
  userName?: string | null,
  firstName?: string | null,
  middleName?: string | null,
  familyName?: string | null,
};

export enum UserAccessStatus {
  pending = "pending",
  active = "active",
  inactive = "inactive",
}


export type Space = {
  __typename: "Space",
  spaceID?: string,
  spaceName?: string | null,
  owner?: UserRef,
  admins?:  Array<UserRef | null > | null,
  recipe?: string | null,
  iaas?: string | null,
  region?: string | null,
  version?: string | null,
  publicKey?: string | null,
  certificate?: string | null,
  isEgressNode?: boolean | null,
  // common configuration associated
  // with the space such as default
  // settings for new space users
  settings?: string | null,
  // space node
  ipAddress?: string | null,
  fqdn?: string | null,
  port?: number | null,
  vpnType?: string | null,
  localCARoot?: string | null,
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
  appName?: string | null,
  recipe?: string | null,
  iaas?: string | null,
  region?: string | null,
  status?: AppStatus | null,
  space?: Space,
  users?: AppUsersConnection,
};

export enum AppStatus {
  undeployed = "undeployed",
  running = "running",
  shutdown = "shutdown",
  pending = "pending",
  unknown = "unknown",
}


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
  bytesUploaded?: string | null,
  bytesDownloaded?: string | null,
  accessList?: AppUsersConnection,
  lastConnectTime?: number | null,
  lastConnectDevice?: Device,
};

export enum SpaceStatus {
  undeployed = "undeployed",
  running = "running",
  shutdown = "shutdown",
  pending = "pending",
  unknown = "unknown",
}


export type DeviceInfo = {
  deviceType: string,
  clientVersion: string,
  // ID of device that manages this
  // device
  managedBy?: string | null,
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

export type PublishDataInput = {
  type: PublishDataType,
  compressed: boolean,
  payload: string,
};

// Async push data type
export enum PublishDataType {
  event = "event",
}


export type PublishResult = {
  __typename: "PublishResult",
  success?: boolean,
  error?: string | null,
};

export type UserUpdate = {
  __typename: "UserUpdate",
  userID?: string,
  numDevices?: number | null,
  numSpaces?: number | null,
  user?: User,
};

export type DeviceUpdate = {
  __typename: "DeviceUpdate",
  deviceID?: string,
  numUsers?: number | null,
  device?: Device,
};

export type DeviceUserUpdate = {
  __typename: "DeviceUserUpdate",
  deviceID?: string,
  userID?: string,
  deviceUser?: DeviceUser,
};

export type SpaceUpdate = {
  __typename: "SpaceUpdate",
  spaceID?: string,
  numUsers?: number | null,
  numApps?: number | null,
  space?: Space,
};

export type SpaceUserUpdate = {
  __typename: "SpaceUserUpdate",
  spaceID?: string,
  userID?: string,
  spaceUser?: SpaceUser,
};

export type AppUpdate = {
  __typename: "AppUpdate",
  appID?: string,
  numUsers?: number | null,
  app?: App,
};

export type AppUserUpdate = {
  __typename: "AppUserUpdate",
  appID?: string,
  userID?: string,
  appUser?: AppUser,
};

export type UserSearchFilterInput = {
  userName?: string | null,
  emailAddress?: string | null,
};

export type DeviceAuth = {
  __typename: "DeviceAuth",
  accessType?: AccessType,
  device?: Device,
};

export enum AccessType {
  unauthorized = "unauthorized",
  pending = "pending",
  guest = "guest",
  admin = "admin",
}


export type UpdateUserKeyMutationVariables = {
  userKey?: Key,
};

export type UpdateUserKeyMutation = {
  // Update the logged in user's key
  updateUserKey?:  {
    __typename: "User",
    userID: string,
    userName: string,
    firstName?: string | null,
    middleName?: string | null,
    familyName?: string | null,
    preferredName?: string | null,
    emailAddress?: string | null,
    mobilePhone?: string | null,
    confirmed?: boolean | null,
    publicKey?: string | null,
    certificate?: string | null,
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
        bytesUploaded?: string | null,
        bytesDownloaded?: string | null,
        lastAccessTime?: number | null,
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
        bytesUploaded?: string | null,
        bytesDownloaded?: string | null,
        lastConnectTime?: number | null,
      } | null > | null,
    } | null,
    // A user's universal config is an encrypted
    // document containing metadata of all spaces the
    // user owns.
    universalConfig?: string | null,
  } | null,
};

export type UpdateUserConfigMutationVariables = {
  universalConfig?: string,
  asOf?: string,
};

export type UpdateUserConfigMutation = {
  // Update the logged in user's universal config
  updateUserConfig: string,
};

export type AddDeviceMutationVariables = {
  deviceName?: string,
  deviceInfo?: DeviceInfo,
  deviceKey?: Key,
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
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null,
      user?:  {
        __typename: "User",
        userID: string,
        userName: string,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
        preferredName?: string | null,
        emailAddress?: string | null,
        mobilePhone?: string | null,
        confirmed?: boolean | null,
        publicKey?: string | null,
        certificate?: string | null,
        // A user's universal config is an encrypted
        // document containing metadata of all spaces the
        // user owns.
        universalConfig?: string | null,
      } | null,
      isOwner?: boolean | null,
      status?: UserAccessStatus | null,
      bytesUploaded?: string | null,
      bytesDownloaded?: string | null,
      lastAccessTime?: number | null,
      lastConnectSpace?:  {
        __typename: "Space",
        spaceID: string,
        spaceName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        version?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        isEgressNode?: boolean | null,
        // common configuration associated
        // with the space such as default
        // settings for new space users
        settings?: string | null,
        // space node
        ipAddress?: string | null,
        fqdn?: string | null,
        port?: number | null,
        vpnType?: string | null,
        localCARoot?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
    },
  } | null,
};

export type AddDeviceUserMutationVariables = {
  deviceID?: string,
  userID?: string | null,
};

export type AddDeviceUserMutation = {
  // Add logged in user to the given device
  addDeviceUser?:  {
    __typename: "DeviceUser",
    device?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
    lastAccessTime?: number | null,
    lastConnectSpace?:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
    lastAccessTime?: number | null,
    lastConnectSpace?:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
    lastAccessTime?: number | null,
    lastConnectSpace?:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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

export type UpdateDeviceMutationVariables = {
  deviceID?: string,
  deviceKey?: Key | null,
  clientVersion?: string | null,
  settings?: string | null,
};

export type UpdateDeviceMutation = {
  // Update device
  updateDevice?:  {
    __typename: "Device",
    deviceID: string,
    deviceName?: string | null,
    owner?:  {
      __typename: "UserRef",
      userID: string,
      userName?: string | null,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
    } | null,
    // device info
    deviceType?: string | null,
    clientVersion?: string | null,
    publicKey?: string | null,
    certificate?: string | null,
    // common configuration associated
    // with the device such as default
    // settings for new device users
    settings?: string | null,
    // ID of managing device if this
    // is a managed device. '-' if not.
    managedBy?: string | null,
    // managed devices
    managedDevices?:  Array< {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null > | null,
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
        bytesUploaded?: string | null,
        bytesDownloaded?: string | null,
        lastAccessTime?: number | null,
      } | null > | null,
    } | null,
  } | null,
};

export type AddSpaceMutationVariables = {
  spaceName?: string,
  spaceKey?: Key,
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
        spaceName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        version?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        isEgressNode?: boolean | null,
        // common configuration associated
        // with the space such as default
        // settings for new space users
        settings?: string | null,
        // space node
        ipAddress?: string | null,
        fqdn?: string | null,
        port?: number | null,
        vpnType?: string | null,
        localCARoot?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
      user?:  {
        __typename: "User",
        userID: string,
        userName: string,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
        preferredName?: string | null,
        emailAddress?: string | null,
        mobilePhone?: string | null,
        confirmed?: boolean | null,
        publicKey?: string | null,
        certificate?: string | null,
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
      bytesUploaded?: string | null,
      bytesDownloaded?: string | null,
      accessList?:  {
        __typename: "AppUsersConnection",
        totalCount?: number | null,
      } | null,
      lastConnectTime?: number | null,
      lastConnectDevice?:  {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null,
    },
  } | null,
};

export type InviteSpaceUserMutationVariables = {
  spaceID?: string,
  userID?: string,
  isAdmin?: boolean | null,
  isEgressNode?: boolean | null,
};

export type InviteSpaceUserMutation = {
  // Invite a user to connect and use space services
  inviteSpaceUser?:  {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
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
    lastConnectDevice?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
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
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
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
    lastConnectDevice?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
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
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
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
    lastConnectDevice?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
  } | null,
};

export type DeleteSpaceUserMutationVariables = {
  spaceID?: string,
  userID?: string | null,
};

export type DeleteSpaceUserMutation = {
  // Delete a space user from the space owned by
  // the logged in user
  deleteSpaceUser?:  {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
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
    lastConnectDevice?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
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
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
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
    lastConnectDevice?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
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
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
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
    lastConnectDevice?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
  } | null,
};

export type UpdateSpaceMutationVariables = {
  spaceID?: string,
  spaceKey?: Key | null,
  version?: string | null,
  settings?: string | null,
};

export type UpdateSpaceMutation = {
  // Update space
  updateSpace?:  {
    __typename: "Space",
    spaceID: string,
    spaceName?: string | null,
    owner?:  {
      __typename: "UserRef",
      userID: string,
      userName?: string | null,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
    } | null,
    admins?:  Array< {
      __typename: "UserRef",
      userID: string,
      userName?: string | null,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
    } | null > | null,
    recipe?: string | null,
    iaas?: string | null,
    region?: string | null,
    version?: string | null,
    publicKey?: string | null,
    certificate?: string | null,
    isEgressNode?: boolean | null,
    // common configuration associated
    // with the space such as default
    // settings for new space users
    settings?: string | null,
    // space node
    ipAddress?: string | null,
    fqdn?: string | null,
    port?: number | null,
    vpnType?: string | null,
    localCARoot?: string | null,
    apps?:  {
      __typename: "SpaceAppsConnection",
      pageInfo:  {
        __typename: "PageInfo",
        // When paginating forwards, are there more items?
        hasNextPage: boolean,
        // When paginating backwards, are there more items?
        hasPreviousePage: boolean,
      },
      totalCount?: number | null,
      spaceApps?:  Array< {
        __typename: "App",
        appID: string,
        appName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        status?: AppStatus | null,
      } | null > | null,
    } | null,
    users?:  {
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
        bytesUploaded?: string | null,
        bytesDownloaded?: string | null,
        lastConnectTime?: number | null,
      } | null > | null,
    } | null,
    status?: SpaceStatus | null,
    lastSeen?: number | null,
  } | null,
};

export type UpdateSpaceUserMutationVariables = {
  spaceID?: string,
  userID?: string | null,
  isEgressNode?: boolean | null,
};

export type UpdateSpaceUserMutation = {
  // Update space user
  updateSpaceUser?:  {
    __typename: "SpaceUser",
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
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
    lastConnectDevice?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
  } | null,
};

export type AddAppMutationVariables = {
  appName?: string,
  recipe?: string,
  iaas?: string,
  region?: string,
  spaceID?: string,
};

export type AddAppMutation = {
  // Add new app for the logged in user
  addApp?:  {
    __typename: "App",
    appID: string,
    appName?: string | null,
    recipe?: string | null,
    iaas?: string | null,
    region?: string | null,
    status?: AppStatus | null,
    space?:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
    users?:  {
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
  } | null,
};

export type AddAppUserMutationVariables = {
  appID?: string,
  userID?: string,
};

export type AddAppUserMutation = {
  // Add app user
  addAppUser?:  {
    __typename: "AppUser",
    app?:  {
      __typename: "App",
      appID: string,
      appName?: string | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      status?: AppStatus | null,
      space?:  {
        __typename: "Space",
        spaceID: string,
        spaceName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        version?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        isEgressNode?: boolean | null,
        // common configuration associated
        // with the space such as default
        // settings for new space users
        settings?: string | null,
        // space node
        ipAddress?: string | null,
        fqdn?: string | null,
        port?: number | null,
        vpnType?: string | null,
        localCARoot?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
      users?:  {
        __typename: "AppUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    lastAccessTime?: number | null,
  } | null,
};

export type DeleteAppUserMutationVariables = {
  appID?: string,
  userID?: string,
};

export type DeleteAppUserMutation = {
  // Delete app user
  deleteAppUser?:  {
    __typename: "AppUser",
    app?:  {
      __typename: "App",
      appID: string,
      appName?: string | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      status?: AppStatus | null,
      space?:  {
        __typename: "Space",
        spaceID: string,
        spaceName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        version?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        isEgressNode?: boolean | null,
        // common configuration associated
        // with the space such as default
        // settings for new space users
        settings?: string | null,
        // space node
        ipAddress?: string | null,
        fqdn?: string | null,
        port?: number | null,
        vpnType?: string | null,
        localCARoot?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
      users?:  {
        __typename: "AppUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    lastAccessTime?: number | null,
  } | null,
};

export type DeleteAppMutationVariables = {
  appID?: string,
};

export type DeleteAppMutation = {
  // Delete app
  deleteApp?: Array< string | null > | null,
};

export type PublishDataMutationVariables = {
  data?: Array< PublishDataInput >,
};

export type PublishDataMutation = {
  // Asynchronously pushes a data payload of a
  // given type to the platform. The only response
  // expected will be a success of fail
  publishData?:  Array< {
    __typename: "PublishResult",
    success: boolean,
    error?: string | null,
  } | null > | null,
};

export type PushUsersUpdateMutationVariables = {
  data?: string,
};

export type PushUsersUpdateMutation = {
  // Mutations to data entities attached to
  // subscriptions that will push changes to
  // clients with active subscriptions to
  // these entitites.
  pushUsersUpdate?:  {
    __typename: "UserUpdate",
    userID: string,
    numDevices?: number | null,
    numSpaces?: number | null,
    user:  {
      __typename: "User",
      userID: string,
      userName: string,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    },
  } | null,
};

export type PushDevicesUpdateMutationVariables = {
  data?: string,
};

export type PushDevicesUpdateMutation = {
  pushDevicesUpdate?:  {
    __typename: "DeviceUpdate",
    deviceID: string,
    numUsers?: number | null,
    device:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    },
  } | null,
};

export type PushDeviceUsersUpdateMutationVariables = {
  data?: string,
};

export type PushDeviceUsersUpdateMutation = {
  pushDeviceUsersUpdate?:  {
    __typename: "DeviceUserUpdate",
    deviceID: string,
    userID: string,
    deviceUser:  {
      __typename: "DeviceUser",
      device?:  {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null,
      user?:  {
        __typename: "User",
        userID: string,
        userName: string,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
        preferredName?: string | null,
        emailAddress?: string | null,
        mobilePhone?: string | null,
        confirmed?: boolean | null,
        publicKey?: string | null,
        certificate?: string | null,
        // A user's universal config is an encrypted
        // document containing metadata of all spaces the
        // user owns.
        universalConfig?: string | null,
      } | null,
      isOwner?: boolean | null,
      status?: UserAccessStatus | null,
      bytesUploaded?: string | null,
      bytesDownloaded?: string | null,
      lastAccessTime?: number | null,
      lastConnectSpace?:  {
        __typename: "Space",
        spaceID: string,
        spaceName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        version?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        isEgressNode?: boolean | null,
        // common configuration associated
        // with the space such as default
        // settings for new space users
        settings?: string | null,
        // space node
        ipAddress?: string | null,
        fqdn?: string | null,
        port?: number | null,
        vpnType?: string | null,
        localCARoot?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
    },
  } | null,
};

export type PushSpacesUpdateMutationVariables = {
  data?: string,
};

export type PushSpacesUpdateMutation = {
  pushSpacesUpdate?:  {
    __typename: "SpaceUpdate",
    spaceID: string,
    numUsers?: number | null,
    numApps?: number | null,
    space:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
    },
  } | null,
};

export type PushSpaceUsersUpdateMutationVariables = {
  data?: string,
};

export type PushSpaceUsersUpdateMutation = {
  pushSpaceUsersUpdate?:  {
    __typename: "SpaceUserUpdate",
    spaceID: string,
    userID: string,
    spaceUser:  {
      __typename: "SpaceUser",
      space?:  {
        __typename: "Space",
        spaceID: string,
        spaceName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        version?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        isEgressNode?: boolean | null,
        // common configuration associated
        // with the space such as default
        // settings for new space users
        settings?: string | null,
        // space node
        ipAddress?: string | null,
        fqdn?: string | null,
        port?: number | null,
        vpnType?: string | null,
        localCARoot?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
      user?:  {
        __typename: "User",
        userID: string,
        userName: string,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
        preferredName?: string | null,
        emailAddress?: string | null,
        mobilePhone?: string | null,
        confirmed?: boolean | null,
        publicKey?: string | null,
        certificate?: string | null,
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
      bytesUploaded?: string | null,
      bytesDownloaded?: string | null,
      accessList?:  {
        __typename: "AppUsersConnection",
        totalCount?: number | null,
      } | null,
      lastConnectTime?: number | null,
      lastConnectDevice?:  {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null,
    },
  } | null,
};

export type PushAppsUpdateMutationVariables = {
  data?: string,
};

export type PushAppsUpdateMutation = {
  pushAppsUpdate?:  {
    __typename: "AppUpdate",
    appID: string,
    numUsers?: number | null,
    app:  {
      __typename: "App",
      appID: string,
      appName?: string | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      status?: AppStatus | null,
      space?:  {
        __typename: "Space",
        spaceID: string,
        spaceName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        version?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        isEgressNode?: boolean | null,
        // common configuration associated
        // with the space such as default
        // settings for new space users
        settings?: string | null,
        // space node
        ipAddress?: string | null,
        fqdn?: string | null,
        port?: number | null,
        vpnType?: string | null,
        localCARoot?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
      users?:  {
        __typename: "AppUsersConnection",
        totalCount?: number | null,
      } | null,
    },
  } | null,
};

export type PushAppUsersUpdateMutationVariables = {
  data?: string,
};

export type PushAppUsersUpdateMutation = {
  pushAppUsersUpdate?:  {
    __typename: "AppUserUpdate",
    appID: string,
    userID: string,
    appUser:  {
      __typename: "AppUser",
      app?:  {
        __typename: "App",
        appID: string,
        appName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        status?: AppStatus | null,
      } | null,
      user?:  {
        __typename: "User",
        userID: string,
        userName: string,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
        preferredName?: string | null,
        emailAddress?: string | null,
        mobilePhone?: string | null,
        confirmed?: boolean | null,
        publicKey?: string | null,
        certificate?: string | null,
        // A user's universal config is an encrypted
        // document containing metadata of all spaces the
        // user owns.
        universalConfig?: string | null,
      } | null,
      lastAccessTime?: number | null,
    },
  } | null,
};

export type TouchSubscriptionsMutationVariables = {
  subs?: Array< string > | null,
};

export type TouchSubscriptionsMutation = {
  // Subscription keep alive call
  touchSubscriptions?: number | null,
};

export type UserSearchQueryVariables = {
  filter?: UserSearchFilterInput,
  limit?: number | null,
};

export type UserSearchQuery = {
  // Returns a list of users matching
  // the given filter
  userSearch:  Array< {
    __typename: "UserRef",
    userID: string,
    userName?: string | null,
    firstName?: string | null,
    middleName?: string | null,
    familyName?: string | null,
  } | null >,
};

export type AuthDeviceQueryVariables = {
  idKey?: string,
};

export type AuthDeviceQuery = {
  // Authenticates and authorizes the
  // current logged in user on the device
  // identified by the given key. The
  // response returns the user's access
  // type on the device and if the user
  // has admin access the full device
  // information will be returned.
  authDevice?:  {
    __typename: "DeviceAuth",
    accessType: AccessType,
    device?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
  } | null,
};

export type GetUserQuery = {
  // Return the logged in user
  getUser?:  {
    __typename: "User",
    userID: string,
    userName: string,
    firstName?: string | null,
    middleName?: string | null,
    familyName?: string | null,
    preferredName?: string | null,
    emailAddress?: string | null,
    mobilePhone?: string | null,
    confirmed?: boolean | null,
    publicKey?: string | null,
    certificate?: string | null,
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
        bytesUploaded?: string | null,
        bytesDownloaded?: string | null,
        lastAccessTime?: number | null,
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
        bytesUploaded?: string | null,
        bytesDownloaded?: string | null,
        lastConnectTime?: number | null,
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
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
    lastAccessTime?: number | null,
    lastConnectSpace?:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
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
    lastConnectDevice?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
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
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
    user?:  {
      __typename: "User",
      userID: string,
      userName: string,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
    lastAccessTime?: number | null,
    lastConnectSpace?:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    bytesUploaded?: string | null,
    bytesDownloaded?: string | null,
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
    lastConnectDevice?:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    } | null,
  } | null > | null,
};

export type UserUpdatesSubscriptionVariables = {
  userID?: string,
};

export type UserUpdatesSubscription = {
  userUpdates?:  {
    __typename: "UserUpdate",
    userID: string,
    numDevices?: number | null,
    numSpaces?: number | null,
    user:  {
      __typename: "User",
      userID: string,
      userName: string,
      firstName?: string | null,
      middleName?: string | null,
      familyName?: string | null,
      preferredName?: string | null,
      emailAddress?: string | null,
      mobilePhone?: string | null,
      confirmed?: boolean | null,
      publicKey?: string | null,
      certificate?: string | null,
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
    },
  } | null,
};

export type DeviceUpdatesSubscriptionVariables = {
  deviceID?: string,
};

export type DeviceUpdatesSubscription = {
  deviceUpdates?:  {
    __typename: "DeviceUpdate",
    deviceID: string,
    numUsers?: number | null,
    device:  {
      __typename: "Device",
      deviceID: string,
      deviceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      // device info
      deviceType?: string | null,
      clientVersion?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      // common configuration associated
      // with the device such as default
      // settings for new device users
      settings?: string | null,
      // ID of managing device if this
      // is a managed device. '-' if not.
      managedBy?: string | null,
      // managed devices
      managedDevices?:  Array< {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null > | null,
      users?:  {
        __typename: "DeviceUsersConnection",
        totalCount?: number | null,
      } | null,
    },
  } | null,
};

export type DeviceUserUpdatesSubscriptionVariables = {
  deviceID?: string,
  userID?: string,
};

export type DeviceUserUpdatesSubscription = {
  deviceUserUpdates?:  {
    __typename: "DeviceUserUpdate",
    deviceID: string,
    userID: string,
    deviceUser:  {
      __typename: "DeviceUser",
      device?:  {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null,
      user?:  {
        __typename: "User",
        userID: string,
        userName: string,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
        preferredName?: string | null,
        emailAddress?: string | null,
        mobilePhone?: string | null,
        confirmed?: boolean | null,
        publicKey?: string | null,
        certificate?: string | null,
        // A user's universal config is an encrypted
        // document containing metadata of all spaces the
        // user owns.
        universalConfig?: string | null,
      } | null,
      isOwner?: boolean | null,
      status?: UserAccessStatus | null,
      bytesUploaded?: string | null,
      bytesDownloaded?: string | null,
      lastAccessTime?: number | null,
      lastConnectSpace?:  {
        __typename: "Space",
        spaceID: string,
        spaceName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        version?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        isEgressNode?: boolean | null,
        // common configuration associated
        // with the space such as default
        // settings for new space users
        settings?: string | null,
        // space node
        ipAddress?: string | null,
        fqdn?: string | null,
        port?: number | null,
        vpnType?: string | null,
        localCARoot?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
    },
  } | null,
};

export type SpaceUpdatesSubscriptionVariables = {
  spaceID?: string,
};

export type SpaceUpdatesSubscription = {
  spaceUpdates?:  {
    __typename: "SpaceUpdate",
    spaceID: string,
    numUsers?: number | null,
    numApps?: number | null,
    space:  {
      __typename: "Space",
      spaceID: string,
      spaceName?: string | null,
      owner?:  {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null,
      admins?:  Array< {
        __typename: "UserRef",
        userID: string,
        userName?: string | null,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
      } | null > | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      version?: string | null,
      publicKey?: string | null,
      certificate?: string | null,
      isEgressNode?: boolean | null,
      // common configuration associated
      // with the space such as default
      // settings for new space users
      settings?: string | null,
      // space node
      ipAddress?: string | null,
      fqdn?: string | null,
      port?: number | null,
      vpnType?: string | null,
      localCARoot?: string | null,
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
    },
  } | null,
};

export type SpaceUserUpdatesSubscriptionVariables = {
  spaceID?: string,
  userID?: string,
};

export type SpaceUserUpdatesSubscription = {
  spaceUserUpdates?:  {
    __typename: "SpaceUserUpdate",
    spaceID: string,
    userID: string,
    spaceUser:  {
      __typename: "SpaceUser",
      space?:  {
        __typename: "Space",
        spaceID: string,
        spaceName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        version?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        isEgressNode?: boolean | null,
        // common configuration associated
        // with the space such as default
        // settings for new space users
        settings?: string | null,
        // space node
        ipAddress?: string | null,
        fqdn?: string | null,
        port?: number | null,
        vpnType?: string | null,
        localCARoot?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
      user?:  {
        __typename: "User",
        userID: string,
        userName: string,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
        preferredName?: string | null,
        emailAddress?: string | null,
        mobilePhone?: string | null,
        confirmed?: boolean | null,
        publicKey?: string | null,
        certificate?: string | null,
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
      bytesUploaded?: string | null,
      bytesDownloaded?: string | null,
      accessList?:  {
        __typename: "AppUsersConnection",
        totalCount?: number | null,
      } | null,
      lastConnectTime?: number | null,
      lastConnectDevice?:  {
        __typename: "Device",
        deviceID: string,
        deviceName?: string | null,
        // device info
        deviceType?: string | null,
        clientVersion?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        // common configuration associated
        // with the device such as default
        // settings for new device users
        settings?: string | null,
        // ID of managing device if this
        // is a managed device. '-' if not.
        managedBy?: string | null,
      } | null,
    },
  } | null,
};

export type AppUpdatesSubscriptionVariables = {
  appID?: string,
};

export type AppUpdatesSubscription = {
  appUpdates?:  {
    __typename: "AppUpdate",
    appID: string,
    numUsers?: number | null,
    app:  {
      __typename: "App",
      appID: string,
      appName?: string | null,
      recipe?: string | null,
      iaas?: string | null,
      region?: string | null,
      status?: AppStatus | null,
      space?:  {
        __typename: "Space",
        spaceID: string,
        spaceName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        version?: string | null,
        publicKey?: string | null,
        certificate?: string | null,
        isEgressNode?: boolean | null,
        // common configuration associated
        // with the space such as default
        // settings for new space users
        settings?: string | null,
        // space node
        ipAddress?: string | null,
        fqdn?: string | null,
        port?: number | null,
        vpnType?: string | null,
        localCARoot?: string | null,
        status?: SpaceStatus | null,
        lastSeen?: number | null,
      } | null,
      users?:  {
        __typename: "AppUsersConnection",
        totalCount?: number | null,
      } | null,
    },
  } | null,
};

export type AppUserUpdatesSubscriptionVariables = {
  appID?: string,
  userID?: string,
};

export type AppUserUpdatesSubscription = {
  appUserUpdates?:  {
    __typename: "AppUserUpdate",
    appID: string,
    userID: string,
    appUser:  {
      __typename: "AppUser",
      app?:  {
        __typename: "App",
        appID: string,
        appName?: string | null,
        recipe?: string | null,
        iaas?: string | null,
        region?: string | null,
        status?: AppStatus | null,
      } | null,
      user?:  {
        __typename: "User",
        userID: string,
        userName: string,
        firstName?: string | null,
        middleName?: string | null,
        familyName?: string | null,
        preferredName?: string | null,
        emailAddress?: string | null,
        mobilePhone?: string | null,
        confirmed?: boolean | null,
        publicKey?: string | null,
        certificate?: string | null,
        // A user's universal config is an encrypted
        // document containing metadata of all spaces the
        // user owns.
        universalConfig?: string | null,
      } | null,
      lastAccessTime?: number | null,
    },
  } | null,
};
