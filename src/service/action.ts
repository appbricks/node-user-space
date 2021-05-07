import * as redux from 'redux';

import {
  UserSearchConnection,
  Device,
  DeviceUser,
  Space,
  SpaceUser,
  CursorInput
} from '../model/types';

export interface UserSearchPayload {
  namePrefix: string,
  limit?: number,
  cursor?: CursorInput
};

export interface UserSearchResultPayload {
  userSearchResult: UserSearchConnection
};

export interface DeviceUserIDPayload {
  deviceID: string
  userID?: string
};

export interface DeviceIDPayload {
  deviceID: string
};

export interface DevicesPayload {
  devices: Device[]
};

export interface DevicePayload {
  device: Device
};

export interface DeviceUserPayload {
  deviceUser: DeviceUser
};

export interface DeviceUsersPayload {
  deviceUsers: DeviceUser[]
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

export interface SpacesPayload {
  spaces: Space[]
};

export interface SpacePayload {
  space: Space
};

export interface SpaceUserPayload {
  spaceUser: SpaceUser
};

export interface SpaceUsersPayload {
  spaceUsers: SpaceUser[]
};

export interface AppIDPayload {
  spaceID: string
};

// User-Space dispatch function props
export interface UserSpaceActionProps {
  userspaceService?: {
    userSearch: (namePrefix: string, limit?: number) => redux.Action
    userSearchPagePrev: ()=> redux.Action
    userSearchPageNext: ()=> redux.Action

    // device owner actions
    getUserDevices: () => redux.Action
    getDeviceAccessRequests: (deviceID: string) => redux.Action
    activateUserOnDevice: (deviceID: string, userID: string) => redux.Action
    deleteUserFromDevice: (deviceID: string, userID: string) => redux.Action
    deleteDevice: (deviceID: string) => redux.Action
    subscribeUserDeviceTelemetry: (deviceID: string) => redux.Action
    unsubscribeUserDeviceTelemetry: (deviceID: string) => redux.Action

    // space owner actions
    getUserSpaces: () => redux.Action
    inviteUserToSpace: (spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean) => redux.Action
    removeUserAccessToSpace: (spaceID: string, userID: string) => redux.Action
    deleteUserFromSpace: (spaceID: string, userID: string) => redux.Action
    deleteSpace: (spaceID: string) => redux.Action
    subscribeUserSpaceTelemetry: (spaceID: string) => redux.Action
    unsubscribeUserSpaceTelemetry: (spaceID: string) => redux.Action

    // space guest actions 
    getSpaceInvitations: () => redux.Action
    acceptSpaceInvitation: (spaceID: string) => redux.Action
    leaveSpace: (spaceID: string) => redux.Action

    // app owner actions
    getUserApps: () => redux.Action
    getAppInvitations: () => redux.Action
    subscribeUserAppTelemetry: (appID: string) => redux.Action
    unsubscribeUserAppTelemetry: (appID: string) => redux.Action
  }
}

// User-Space action types

export const USER_SEARCH = 'userspace/USER_SEARCH';
export const USER_SEARCH_PAGE_PREV = 'userspace/USER_SEARCH_PAGE_PREV';
export const USER_SEARCH_PAGE_NEXT = 'userspace/USER_SEARCH_PAGE_NEXT';

export const GET_USER_DEVICES = 'userspace/GET_USER_DEVICES';
export const GET_DEVICE_ACCESS_REQUESTS = 'userspace/GET_DEVICE_ACCESS_REQUESTS';
export const ACTIVATE_USER_ON_DEVICE = 'userspace/ACTIVATE_USER_ON_DEVICE';
export const DELETE_USER_FROM_DEVICE = 'userspace/DELETE_USER_FROM_DEVICE';
export const DELETE_DEVICE = 'userspace/DELETE_DEVICE';
export const GET_USER_DEVICE_TELEMETRY = 'userspace/GET_USER_DEVICE_TELEMETRY';

export const GET_USER_SPACES = 'userspace/GET_USER_SPACES';
export const INVITE_USER_TO_SPACE = 'userspace/INVITE_USER_TO_SPACE';
export const REMOVE_USER_ACCESS_TO_SPACE = 'userspace/REMOVE_USER_ACCESS_TO_SPACE';
export const DELETE_USER_FROM_SPACE = 'userspace/DELETE_USER_FROM_SPACE';
export const DELETE_SPACE = 'userspace/DELETE_SPACE';
export const GET_USER_SPACE_TELEMETRY = 'userspace/GET_USER_SPACE_TELEMETRY';

export const GET_SPACE_INVITATIONS = 'userspace/GET_SPACE_INVITATIONS';
export const ACCEPT_SPACE_INVITATION = 'userspace/ACCEPT_SPACE_INVITATION';
export const LEAVE_SPACE = 'userspace/LEAVE_SPACE';

export const GET_USER_APPS = 'userspace/GET_USER_APPS';
export const GET_APP_INVITATIONS = 'userspace/GET_APP_INVITATIONS';
export const GET_USER_APP_TELEMETRY = 'userspace/GET_USER_APP_TELEMETRY';
