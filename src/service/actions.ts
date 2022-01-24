import * as actions from 'redux';

import {
  UserRef,
  User,
  Device,
  DeviceUser,
  Space,
  SpaceUser,
} from '../model/types';

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
  isAdmin: boolean 
  isEgressNode: boolean
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

export interface AppIDPayload {
  spaceID: string
};

// User-Space dispatch function props
export interface UserSpaceActionProps {
  userspaceService?: {
    userSearch: (namePrefix: string, limit?: number) => actions.Action
    clearUserSearchResults: () => actions.Action
    subscribeToUserUpdates: (userID: string) => actions.Action
    unsubscribeFromUserUpdates: (userID: string) => actions.Action

    // device owner actions
    getUserDevices: () => actions.Action
    getDeviceAccessRequests: (deviceID: string) => actions.Action
    activateUserOnDevice: (deviceID: string, userID: string) => actions.Action
    deleteUserFromDevice: (deviceID: string, userID: string) => actions.Action
    deleteDevice: (deviceID: string) => actions.Action

    // space owner actions
    getUserSpaces: () => actions.Action
    inviteUserToSpace: (spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean) => actions.Action
    grantUserAccessToSpace: (spaceID: string, userID: string) => actions.Action
    removeUserAccessToSpace: (spaceID: string, userID: string) => actions.Action
    deleteUserFromSpace: (spaceID: string, userID: string) => actions.Action
    deleteSpace: (spaceID: string) => actions.Action

    // space guest actions 
    getSpaceInvitations: () => actions.Action
    acceptSpaceInvitation: (spaceID: string) => actions.Action
    leaveSpace: (spaceID: string) => actions.Action

    // app owner actions
    getUserApps: () => actions.Action
    getAppInvitations: () => actions.Action
  }
}

// User-Space action types

export const USER_SEARCH = 'userspace/USER_SEARCH';
export const CLEAR_USER_SEARCH_RESULTS = 'userspace/CLEAR_USER_SEARCH_RESULTS';
export const SUBSCRIBE_TO_USER_UPDATES = 'userspace/SUBSCRIBE_TO_USER_UPDATES';
export const USER_UPDATE = 'userspace/USER_UPDATE';
export const UNSUBSCRIBE_FROM_USER_UPDATES = 'userspace/UNSUBSCRIBE_FROM_USER_UPDATES';

export const GET_USER_DEVICES = 'userspace/GET_USER_DEVICES';
export const GET_DEVICE_ACCESS_REQUESTS = 'userspace/GET_DEVICE_ACCESS_REQUESTS';
export const ACTIVATE_USER_ON_DEVICE = 'userspace/ACTIVATE_USER_ON_DEVICE';
export const DELETE_USER_FROM_DEVICE = 'userspace/DELETE_USER_FROM_DEVICE';
export const DELETE_DEVICE = 'userspace/DELETE_DEVICE';
export const SUBSCRIBE_TO_DEVICE_UPDATES = 'userspace/SUBSCRIBE_TO_DEVICE_UPDATES';
export const DEVICE_UPDATE = 'userspace/DEVICE_UPDATE';
export const SUBSCRIBE_TO_DEVICE_TELEMETRY = 'userspace/SUBSCRIBE_TO_DEVICE_TELEMETRY';
export const DEVICE_TELEMETRY = 'userspace/DEVICE_TELEMETRY';

export const GET_USER_SPACES = 'userspace/GET_USER_SPACES';
export const INVITE_USER_TO_SPACE = 'userspace/INVITE_USER_TO_SPACE';
export const GRANT_USER_ACCESS_TO_SPACE = 'userspace/GRANT_USER_ACCESS_TO_SPACE';
export const REMOVE_USER_ACCESS_TO_SPACE = 'userspace/REMOVE_USER_ACCESS_TO_SPACE';
export const DELETE_USER_FROM_SPACE = 'userspace/DELETE_USER_FROM_SPACE';
export const DELETE_SPACE = 'userspace/DELETE_SPACE';
export const SUBSCRIBE_TO_SPACE_UPDATES = 'userspace/SUBSCRIBE_TO_SPACE_UPDATES';
export const SPACE_UPDATE = 'userspace/SPACE_UPDATE';
export const SUBSCRIBE_TO_SPACE_TELEMETRY = 'userspace/SUBSCRIBE_TO_SPACE_TELEMETRY';
export const SPACE_TELEMETRY = 'userspace/SPACE_TELEMETRY';

export const GET_SPACE_INVITATIONS = 'userspace/GET_SPACE_INVITATIONS';
export const ACCEPT_SPACE_INVITATION = 'userspace/ACCEPT_SPACE_INVITATION';
export const LEAVE_SPACE = 'userspace/LEAVE_SPACE';

export const GET_USER_APPS = 'userspace/GET_USER_APPS';
export const GET_APP_INVITATIONS = 'userspace/GET_APP_INVITATIONS';
