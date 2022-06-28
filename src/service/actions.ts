import * as actions from 'redux';

import {
  UserRef,
  User,
  Device,
  DeviceUser,
  Space,
  SpaceUser,
  App,
  AppUser,
  Key
} from '../model/types';
import {
  DisplayType
} from '../model/display';

export interface UserSearchPayload {
  namePrefix: string,
  limit?: number,
};

export interface UserSearchResultPayload {
  userSearchResult: UserRef[]
};

export interface UserIDPayload {
  userID: string
};

export interface UserPayload {
  user: User
};

export interface DeviceUserIDPayload {
  deviceID: string
  userID?: string
};

export interface DeviceIDPayload {
  deviceID: string
};

export interface DevicePayload {
  device: Device
};

export interface DevicesPayload {
  devices: Device[]
};

export interface DeviceUserPayload {
  deviceUser: DeviceUser
};

export interface DeviceUsersPayload {
  deviceUsers: DeviceUser[]
};

export interface DeviceUpdateSubscriptionPayload {
  subscribeDevices: string[]
  unsubscribeDevices: string[]
};

export interface DeviceTelemetrySubscriptionPayload {
  subscribeDeviceUsers: { deviceID: string, userID: string }[]
  unsubscribeDeviceUsers: { deviceID: string, userID: string }[]
};

export interface DeviceUpdatePayload {
  deviceID: string
  deviceKey?: Key
  clientVersion?: string
  settings?: DisplayType
}

export interface SpaceUserIDPayload {
  spaceID: string
  userID?: string
};

export interface SpaceIDPayload {
  spaceID: string
};

export interface SpaceInvitationPayload {
  spaceID: string
  userID: string
  settings: SpaceUserSettings
};

export interface SpacePayload {
  space: Space
};

export interface SpacesPayload {
  spaces: Space[]
};

export interface SpaceUserPayload {
  spaceUser: SpaceUser
};

export interface SpaceUsersPayload {
  spaceUsers: SpaceUser[]
};

export interface SpaceUpdateSubscriptionPayload {
  subscribeSpaces: string[]
  unsubscribeSpaces: string[]
};

export interface SpaceTelemetrySubscriptionPayload {
  subscribeSpaceUsers: { spaceID: string, userID: string }[]
  unsubscribeSpaceUsers: { spaceID: string, userID: string }[]
};

export interface SpaceUpdatePayload {
  spaceID: string
  spaceKey?: Key
  version?: string
  settings?: DisplayType
}

export interface SpaceUserUpdatePayload {
  spaceID: string
  userID: string
  settings: SpaceUserSettings
}

export interface AppUserIDPayload {
  appID: string
  userID?: string
}

export interface AppIDPayload {
  appID: string
};

export interface AppPayload {
  app: App
};

export interface AppUserPayload {
  appUser: AppUser
};

export interface AppUsersPayload {
  appUsers: AppUser[]
};

export interface AppUpdateSubscriptionPayload {
  subscribeApps: string[]
  unsubscribeApps: string[]
};

export interface AppTelemetrySubscriptionPayload {
  subscribeAppUsers: { appID: string, userID: string }[]
  unsubscribeAppUsers: { appID: string, userID: string }[]
};

// User-Space dispatch function props
export interface UserSpaceActionProps {
  userspaceService?: {
    userSearch: (namePrefix: string, limit?: number) => actions.Action
    clearUserSearchResults: () => actions.Action

    // device owner actions
    getUserDevices: () => actions.Action
    getDeviceAccessRequests: (deviceID: string) => actions.Action
    activateUserOnDevice: (deviceID: string, userID: string) => actions.Action
    deleteUserFromDevice: (deviceID: string, userID?: string) => actions.Action
    deleteDevice: (deviceID: string) => actions.Action
    updateDevice: (deviceID: string, deviceKey?: Key, clientVersion?: string, settings?: DisplayType) => actions.Action
    unsubscribeFromDeviceUpdates: () => actions.Action

    // space owner actions
    getUserSpaces: () => actions.Action
    inviteUserToSpace: (spaceID: string, userID: string, settings: SpaceUserSettings) => actions.Action
    grantUserAccessToSpace: (spaceID: string, userID: string) => actions.Action
    removeUserAccessToSpace: (spaceID: string, userID: string) => actions.Action
    deleteUserFromSpace: (spaceID: string, userID?: string) => actions.Action
    deleteSpace: (spaceID: string) => actions.Action
    updateSpace: (spaceID: string, spaceKey?: Key, version?: string, settings?: DisplayType) => actions.Action
    updateSpaceUser: (spaceID: string, userID: string, settings: SpaceUserSettings) => actions.Action
    unsubscribeFromSpaceUpdates: () => actions.Action

    // space guest actions 
    getSpaceInvitations: () => actions.Action
    acceptSpaceInvitation: (spaceID: string) => actions.Action
    leaveSpace: (spaceID: string) => actions.Action

    // app owner actions
    getUserApps: () => actions.Action
    grantUserAccessToApp: (appID: string, userID: string) => actions.Action
    removeUserAccessToApp: (appID: string, userID?: string) => actions.Action
    deleteApp: (appID: string) => actions.Action
    unsubscribeFromAppUpdates: () => actions.Action
  }
}

// Common types

export type SpaceUserSettings = {
  isSpaceAdmin?: boolean
  canUseSpaceForEgress?: boolean
  enableSiteBlocking?: boolean
}

// User-Space action types

export const USER_SEARCH = 'userspace/USER_SEARCH';
export const CLEAR_USER_SEARCH_RESULTS = 'userspace/CLEAR_USER_SEARCH_RESULTS';

export const GET_USER_DEVICES = 'userspace/GET_USER_DEVICES';
export const GET_DEVICE_ACCESS_REQUESTS = 'userspace/GET_DEVICE_ACCESS_REQUESTS';
export const ACTIVATE_USER_ON_DEVICE = 'userspace/ACTIVATE_USER_ON_DEVICE';
export const DELETE_USER_FROM_DEVICE = 'userspace/DELETE_USER_FROM_DEVICE';
export const DELETE_DEVICE = 'userspace/DELETE_DEVICE';
export const UPDATE_DEVICE = 'userspace/UPDATE_DEVICE';
export const SUBSCRIBE_TO_DEVICE_UPDATES = 'userspace/SUBSCRIBE_TO_DEVICE_UPDATES';
export const UNSUBSCRIBE_FROM_DEVICE_UPDATES = 'userspace/UNSUBSCRIBE_FROM_DEVICE_UPDATES';
export const DEVICE_UPDATE = 'userspace/DEVICE_UPDATE';
export const SUBSCRIBE_TO_DEVICE_TELEMETRY = 'userspace/SUBSCRIBE_TO_DEVICE_TELEMETRY';
export const DEVICE_TELEMETRY = 'userspace/DEVICE_TELEMETRY';

export const GET_USER_SPACES = 'userspace/GET_USER_SPACES';
export const INVITE_USER_TO_SPACE = 'userspace/INVITE_USER_TO_SPACE';
export const GRANT_USER_ACCESS_TO_SPACE = 'userspace/GRANT_USER_ACCESS_TO_SPACE';
export const REMOVE_USER_ACCESS_TO_SPACE = 'userspace/REMOVE_USER_ACCESS_TO_SPACE';
export const DELETE_USER_FROM_SPACE = 'userspace/DELETE_USER_FROM_SPACE';
export const DELETE_SPACE = 'userspace/DELETE_SPACE';
export const UPDATE_SPACE = 'userspace/UPDATE_SPACE';
export const UPDATE_SPACE_USER = 'userspace/UPDATE_SPACE_USER';
export const SUBSCRIBE_TO_SPACE_UPDATES = 'userspace/SUBSCRIBE_TO_SPACE_UPDATES';
export const UNSUBSCRIBE_FROM_SPACE_UPDATES = 'userspace/UNSUBSCRIBE_FROM_SPACE_UPDATES';
export const SPACE_UPDATE = 'userspace/SPACE_UPDATE';
export const SUBSCRIBE_TO_SPACE_TELEMETRY = 'userspace/SUBSCRIBE_TO_SPACE_TELEMETRY';
export const SPACE_TELEMETRY = 'userspace/SPACE_TELEMETRY';

export const GET_SPACE_INVITATIONS = 'userspace/GET_SPACE_INVITATIONS';
export const ACCEPT_SPACE_INVITATION = 'userspace/ACCEPT_SPACE_INVITATION';
export const LEAVE_SPACE = 'userspace/LEAVE_SPACE';

export const GET_USER_APPS = 'userspace/GET_USER_APPS';
export const GRANT_USER_ACCESS_TO_APP = 'userspace/GRANT_USER_ACCESS_TO_APP';
export const REMOVE_USER_ACCESS_TO_APP = 'userspace/REMOVE_USER_ACCESS_TO_APP';
export const DELETE_APP = 'userspace/DELETE_APP';
export const SUBSCRIBE_TO_APP_UPDATES = 'userspace/SUBSCRIBE_TO_APP_UPDATES';
export const UNSUBSCRIBE_FROM_APP_UPDATES = 'userspace/UNSUBSCRIBE_FROM_APP_UPDATES';
export const APP_UPDATE = 'userspace/APP_UPDATE';
export const SUBSCRIBE_TO_APP_TELEMETRY = 'userspace/SUBSCRIBE_TO_APP_TELEMETRY';
export const APP_TELEMETRY = 'userspace/APP_TELEMETRY';

