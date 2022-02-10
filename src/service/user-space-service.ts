import * as redux from 'redux';
import { Epic } from 'redux-observable';

import {
  Action,
  reducerDelegate,
  Logger,
  dateTimeToLocale,
  bytesToSize
} from '@appbricks/utils';

import {
  UserRef,
  User,
  UserAccessStatus,
  Device,
  DeviceUser,
  Space,
  SpaceUser,
  SpaceStatus
} from '../model/types';

import {
  DeviceDetail,
  DeviceUserListItem,
  SpaceDetail,
  SpaceUserListItem
} from '../model/display';

import Provider from './provider';

import {
  UserSpaceState,
  UserSpaceStateProps,
  initialUserSpaceState
} from './state';

import * as actions from './actions';

import * as userSearch from './actions/user-search';
import * as clearUserSearchResults from './actions/clear-user-search-results';
import * as userUpdates from './actions/user-update-subscription';
import * as getUserDevices from './actions/get-user-devices';
import * as deviceUpdates from './actions/device-update-subscription';
import * as deviceTelemetry from './actions/device-telemetry-subscription';
import * as getDeviceAccessRequests from './actions/get-device-access-requests';
import * as activateUserOnDevice from './actions/activate-user-on-device';
import * as deleteUserFromDevice from './actions/delete-user-from-device';
import * as deleteDevice from './actions/delete-device';
import * as getUserSpaces from './actions/get-user-spaces';
import * as spaceUpdates from './actions/space-updates-subscription';
import * as spaceTelemetry from './actions/space-telemetry-subscription';
import * as inviteUserToSpace from './actions/invite-user-to-space';
import * as deleteUserFromSpace from './actions/delete-user-from-space';
import * as grantUserAccessToSpace from './actions/grant-user-access-to-space';
import * as removeUserAccessToSpace from './actions/remove-user-access-to-space';
import * as deleteSpace from './actions/delete-space';
import * as getSpaceInvitations from './actions/get-space-invitations';
import * as acceptSpaceInvitation from './actions/accept-space-invitation';
import * as leaveSpace from './actions/leave-space';
import * as resetState from './actions/reset-state';

type UserSpacePayload =
  actions.UserSearchPayload |
  actions.UserSearchResultPayload |
  actions.UserIDPayload |
  actions.UserPayload |
  actions.DeviceUserIDPayload |
  actions.DeviceIDPayload |
  actions.DevicePayload |
  actions.DevicesPayload |
  actions.DeviceUserPayload |
  actions.DeviceUsersPayload |
  actions.DeviceUpdateSubscriptionPayload |
  actions.DeviceTelemetrySubscriptionPayload |
  actions.SpaceUserIDPayload |
  actions.SpaceIDPayload |
  actions.SpaceInvitationPayload |
  actions.SpacePayload |
  actions.SpacesPayload |
  actions.SpaceUserPayload |
  actions.SpaceUsersPayload |
  actions.SpaceUpdateSubscriptionPayload |
  actions.SpaceTelemetrySubscriptionPayload;

export default class UserSpaceService {

  logger: Logger;

  csProvider: Provider;

  // service request actions that will result in
  // a service call side-effect that will be
  // followed by a success or error action
  serviceRequests: Set<string>;

  constructor(provider: Provider) {
    this.logger = new Logger('UserSpaceService');

    this.csProvider = provider;

    this.serviceRequests = new Set();
    this.serviceRequests
      .add(actions.USER_SEARCH)
      .add(actions.GET_USER_DEVICES)
      .add(actions.SUBSCRIBE_TO_USER_UPDATES)
      .add(actions.UNSUBSCRIBE_FROM_USER_UPDATES)
      .add(actions.GET_DEVICE_ACCESS_REQUESTS)
      .add(actions.ACTIVATE_USER_ON_DEVICE)
      .add(actions.DELETE_USER_FROM_DEVICE)
      .add(actions.DELETE_USER_FROM_SPACE)
      .add(actions.DELETE_DEVICE)
      .add(actions.SUBSCRIBE_TO_DEVICE_UPDATES)
      .add(actions.SUBSCRIBE_TO_DEVICE_TELEMETRY)
      .add(actions.GET_USER_SPACES)
      .add(actions.INVITE_USER_TO_SPACE)
      .add(actions.GRANT_USER_ACCESS_TO_SPACE)
      .add(actions.REMOVE_USER_ACCESS_TO_SPACE)
      .add(actions.DELETE_SPACE)
      .add(actions.SUBSCRIBE_TO_SPACE_UPDATES)
      .add(actions.SUBSCRIBE_TO_SPACE_TELEMETRY)
      .add(actions.GET_SPACE_INVITATIONS)
      .add(actions.ACCEPT_SPACE_INVITATION)
      .add(actions.LEAVE_SPACE)
      .add(actions.GET_USER_APPS)
      .add(actions.GET_APP_INVITATIONS)
  }

  static stateProps<S extends UserSpaceStateProps, C extends UserSpaceStateProps>(
    state: S, ownProps?: C): UserSpaceStateProps {

    return {
      userspace: state.userspace
    };
  }

  static dispatchProps<C extends UserSpaceStateProps>(
    dispatch: redux.Dispatch<redux.Action>, ownProps?: C): actions.UserSpaceActionProps {

    return {
      userspaceService: {
        // user lookup actions
        userSearch: (namePrefix: string, limit?: number) =>
          userSearch.action(dispatch, namePrefix, limit),
        clearUserSearchResults: () =>
          clearUserSearchResults.action(dispatch),
        subscribeToUserUpdates: (userID: string) =>
          userUpdates.subscribeAction(dispatch, userID),
        unsubscribeFromUserUpdates: (userID: string) =>
          userUpdates.unsubscribeAction(dispatch, userID),

        // device owner actions
        getUserDevices: () =>
          getUserDevices.action(dispatch),
        getDeviceAccessRequests: (deviceID: string) =>
          getDeviceAccessRequests.action(dispatch, deviceID),
        activateUserOnDevice: (deviceID: string, userID: string) =>
          activateUserOnDevice.action(dispatch, deviceID, userID),
        deleteUserFromDevice: (deviceID: string, userID: string) =>
          deleteUserFromDevice.action(dispatch, deviceID, userID),
        deleteDevice: (deviceID: string) =>
          deleteDevice.action(dispatch, deviceID),

        // space owner actions
        getUserSpaces: () =>
          getUserSpaces.action(dispatch),
        inviteUserToSpace: (spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean) =>
          inviteUserToSpace.action(dispatch, spaceID, userID, isAdmin, isEgressNode),
        grantUserAccessToSpace: (spaceID: string, userID: string) =>
          grantUserAccessToSpace.action(dispatch, spaceID, userID),
        removeUserAccessToSpace: (spaceID: string, userID: string) =>
          removeUserAccessToSpace.action(dispatch, spaceID, userID),
        deleteUserFromSpace: (spaceID: string, userID: string) =>
          deleteUserFromSpace.action(dispatch, spaceID, userID),
        deleteSpace: (spaceID: string) =>
          deleteSpace.action(dispatch, spaceID),

        // space guest actions
        getSpaceInvitations: () =>
          getSpaceInvitations.action(dispatch),
        acceptSpaceInvitation: (spaceID: string) =>
          acceptSpaceInvitation.action(dispatch, spaceID),
        leaveSpace: (spaceID: string)  =>
          leaveSpace.action(dispatch, spaceID),

        // app owner actions
        getUserApps: () =>
          dispatch({type: undefined}),
        getAppInvitations: () =>
          dispatch({type: undefined}),
      }
    }
  }

  epics(): Epic[] {
    return [
      userSearch.epic(this.csProvider),
      getUserDevices.epic(this.csProvider),
      userUpdates.subscribeEpic(this.csProvider),
      userUpdates.unsubscribeEpic(this.csProvider),
      getDeviceAccessRequests.epic(this.csProvider),
      activateUserOnDevice.epic(this.csProvider),
      deleteUserFromDevice.epic(this.csProvider),
      deleteDevice.epic(this.csProvider),
      deviceUpdates.subscribeEpic(this.csProvider),
      deviceTelemetry.subscribeEpic(this.csProvider),
      getUserSpaces.epic(this.csProvider),
      inviteUserToSpace.epic(this.csProvider),
      grantUserAccessToSpace.epic(this.csProvider),
      removeUserAccessToSpace.epic(this.csProvider),
      deleteUserFromSpace.epic(this.csProvider),
      deleteSpace.epic(this.csProvider),
      spaceUpdates.subscribeEpic(this.csProvider),
      spaceTelemetry.subscribeEpic(this.csProvider),
      getSpaceInvitations.epic(this.csProvider),
      acceptSpaceInvitation.epic(this.csProvider),
      leaveSpace.epic(this.csProvider),
      resetState.epic(this.csProvider),
    ];
  }

  reducer(): redux.Reducer<UserSpaceState, Action<UserSpacePayload>> {
    return this.reduce.bind(this);
  }

  private reduce(
    state: UserSpaceState = initialUserSpaceState(),
    action: Action<UserSpacePayload>
  ): UserSpaceState {

    switch (action.type) {
      case actions.CLEAR_USER_SEARCH_RESULTS: {
        state = {
          ...state,
          userSearchResult: undefined
        }
        break;
      }
      case actions.DEVICE_UPDATE: {
        const device = (<actions.DevicePayload>action.payload!).device;
        const detail = state.devices[device.deviceID!];
        if (detail) {
          state = {
            ...state,
            devices: {
              ...state.devices,
              [device.deviceID!]: updateDeviceDetail(detail, device)
            }
          }
        }
        break;
      }
      case actions.DEVICE_TELEMETRY: {
        const deviceUser = (<actions.DeviceUserPayload>action.payload!).deviceUser;
        const detail = state.devices[deviceUser.device!.deviceID!];
        const updatedDetail = updateDeviceUserListItem(detail, deviceUser);
        if (updatedDetail) {
          state = {
            ...state,
            devices: {
              ...state.devices,
              [deviceUser.device!.deviceID!]: updatedDetail
            }
          }
        }
        break;
      }
      case actions.SPACE_UPDATE: {
        const space = (<actions.SpacePayload>action.payload!).space;
        const detail = state.spaces[space.spaceID!];
        if (detail) {
          state = {
            ...state,
            spaces: {
              ...state.spaces,
              [space.spaceID!]: updateSpaceDetail(detail, space)
            }
          }
        }
        break;
      }
      case actions.SPACE_TELEMETRY: {
        const spaceUser = (<actions.SpaceUserPayload>action.payload!).spaceUser;
        const detail = state.spaces[spaceUser.space!.spaceID!];
        const updatedDetail = updateSpaceUserListItem(detail, spaceUser);
        if (updatedDetail) {
          state = {
            ...state,
            spaces: {
              ...state.spaces,
              [spaceUser.space!.spaceID!]: updatedDetail
            }
          }
        }
        break;
      }
    }

    return reducerDelegate<UserSpaceState, UserSpacePayload>(
      state,
      action,
      this.serviceRequests,
      this.reduceServiceResponse.bind(this),
      initialUserSpaceState.bind(this)
    );
  }

  private reduceServiceResponse(
    state: UserSpaceState = <UserSpaceState>{},
    action: Action<UserSpacePayload>
  ): UserSpaceState {

    let relatedAction = action.meta.relatedAction!;

    switch (relatedAction.type) {
      case actions.USER_SEARCH: {
        const searchResult = <actions.UserSearchResultPayload>action.payload!;

        return {
          ...state,
          userSearchResult: <UserRef[]>searchResult.userSearchResult
        }
      }
      case actions.GET_USER_DEVICES: {
        const userDevices = (<actions.DeviceUsersPayload>action.payload!).deviceUsers;
        this.logger.trace('Loaded current user\'s devices', userDevices);

        // build user lists for devices owned by the current user
        const devices: { [deviceID: string]: DeviceDetail } = {}
        userDevices.forEach(({ device }) => {
          devices[device!.deviceID!] = deviceDetail(device!)
        })
        this.logger.trace('Current user\'s device collection: ', devices);

        return {
          ...state,
          userDevices,
          devices
        }
      }
      case actions.GET_DEVICE_ACCESS_REQUESTS: {
        const deviceID = (<actions.DeviceIDPayload>relatedAction.payload!).deviceID;
        const deviceUsers = (<actions.DeviceUsersPayload>action.payload!).deviceUsers;

        const deviceAccessRequests = { ...state.deviceAccessRequests };
        deviceAccessRequests[deviceID] = deviceUsers;
        return {
          ...state,
          deviceAccessRequests
        }
      }
      case actions.GET_USER_SPACES: {
        const userSpaces = (<actions.SpaceUsersPayload>action.payload!).spaceUsers;
        this.logger.trace('Loaded current user\'s spaces', userSpaces);

        // build user lists for spaces owned by the current user
        const spaces: { [spaceID: string]: SpaceDetail } = {}
        userSpaces.forEach(({ space }) => {
          spaces[space!.spaceID!] = spaceDetail(space!);
        })
        this.logger.trace('Created current user\'s space collection: ', spaces);

        return {
          ...state,
          userSpaces,
          spaces
        }
      }
      case actions.GET_SPACE_INVITATIONS: {
        const spaceInvitations = (<actions.SpaceUsersPayload>action.payload!).spaceUsers;

        return {
          ...state,
          spaceInvitations
        }
      }
    }

    return state;
  }
}

const deviceDetail = (device: Device): DeviceDetail => {

  const {
    users
  } = device;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let lastAccessedTime = 0;
  let lastAccessedBy = '';
  let lastSpaceConnectedTo = '';
  let bytesDownloaded = 0;
  let bytesUploaded = 0;

  const deviceUsers: DeviceUserListItem[] = [];
  users!.deviceUsers!.forEach(deviceUser => {
    deviceUsers.push(deviceUserListItem(deviceUser!));
    if (deviceUser!.status == UserAccessStatus.active) {
      if (deviceUser!.lastAccessTime! > lastAccessedTime) {
        lastAccessedTime = deviceUser!.lastAccessTime!;
        lastAccessedBy = fullName(deviceUser!.user!);
        lastSpaceConnectedTo = deviceUser!.lastConnectSpace?.spaceName || '';
      }
      if (deviceUser!.lastAccessTime! >= startOfMonth) {
        // only add usage values for current month
        bytesDownloaded += deviceUser!.bytesDownloaded!;
        bytesUploaded += deviceUser!.bytesUploaded!;
      }
    }
  });

  const lastAccessedDataTime = new Date(lastAccessedTime || 0);

  return {
    name: device.deviceName!,
    type: device.deviceType!,
    version: device.clientVersion!,
    ownerAdmin: fullName(device.owner!),
    lastAccessed: lastAccessedTime > 0
      ? dateTimeToLocale(lastAccessedDataTime, false)
      : 'never',
    lastAccessedBy,
    lastSpaceConnectedTo,
    dataUsageIn: bytesToSize(bytesDownloaded),
    dataUsageOut: bytesToSize(bytesUploaded),
    bytesDownloaded,
    bytesUploaded,
    lastAccessedTime,
    users: deviceUsers
  };
}

const deviceUserListItem = (deviceUser: DeviceUser): DeviceUserListItem => {

  const {
    user,
    status,
    bytesUploaded,
    bytesDownloaded,
    lastAccessTime,
    lastConnectSpace
  } = deviceUser;

  const {
    userID,
    userName
  } = user!;

  const dateTime = new Date(lastAccessTime || 0);

  return <DeviceUserListItem>{
    userID,
    userName,
    fullName: fullName(user!),
    status,
    lastSpaceConnectedTo: lastConnectSpace?.spaceName || '',
    dataUsageIn: bytesToSize(bytesDownloaded!),
    dataUsageOut: bytesToSize(bytesUploaded!),
    lastAccessTime: lastAccessTime && lastAccessTime > 0
      ? dateTimeToLocale(dateTime)
      : 'never',
    deviceUser
  }
}

const updateDeviceDetail = (
  detail: DeviceDetail,
  device: Device
): DeviceDetail => {

  const updatedDetail = (({ updatedFields, ...d }) => <DeviceDetail>d)(detail);
  if (device.deviceName) {
    updatedDetail.name = device.deviceName!;
  }
  if (device.deviceType) {
    updatedDetail.type = device.deviceType!;
  }
  if (device.clientVersion) {
    updatedDetail.version = device.clientVersion!;
  }

  return updatedDetail;
}

const updateDeviceUserListItem = (
  detail: DeviceDetail,
  deviceUser: DeviceUser
): DeviceDetail | undefined => {

  const itemIndex = detail.users.findIndex(item => item.userID == deviceUser.user!.userID);
  if (itemIndex != -1) {

    // make copies of the detail and item that
    // will change as part of this update
    const updatedDetail = (({
      updatedFields,
      users,
      ...d
    }) => <DeviceDetail>{
      ...d,
      users: [...users],
    })(detail);
    const updatedItem = (
      ({
        updatedFields,
        deviceUser,
        ...i
      }) => <DeviceUserListItem>{
        ...i,
        deviceUser: { ...deviceUser }
      }
    )(detail.users[itemIndex]);
    const [ item ] = updatedDetail.users.splice(itemIndex, 1, updatedItem);

    if (deviceUser.status) {
      updatedItem.status = deviceUser.status!;
      updatedItem.deviceUser!.status = deviceUser.status!;
    }
    if (deviceUser.bytesDownloaded) {
      updatedDetail.bytesDownloaded -= item.deviceUser!.bytesDownloaded!;
      updatedDetail.bytesDownloaded += deviceUser.bytesDownloaded;
      updatedDetail.dataUsageIn = bytesToSize(updatedDetail.bytesDownloaded);
      updatedItem.dataUsageIn = bytesToSize(deviceUser.bytesDownloaded!);
      updatedItem.deviceUser!.bytesDownloaded = deviceUser.bytesDownloaded
    }
    if (deviceUser.bytesUploaded) {
      updatedDetail.bytesUploaded -= item.deviceUser!!.bytesUploaded!;
      updatedDetail.bytesUploaded += deviceUser.bytesUploaded;
      updatedDetail.dataUsageOut = bytesToSize(updatedDetail.bytesUploaded);
      updatedItem.dataUsageOut = bytesToSize(deviceUser.bytesUploaded!);
      updatedItem.deviceUser!.bytesUploaded = deviceUser.bytesUploaded
    }
    if (deviceUser.lastAccessTime) {
      const dateTime = new Date(deviceUser.lastAccessTime);
      updatedItem.lastAccessTime = dateTimeToLocale(dateTime);
      if (deviceUser.lastAccessTime > detail.lastAccessedTime) {
        updatedDetail.lastAccessedTime = deviceUser.lastAccessTime;
        updatedDetail.lastAccessed = updatedItem.lastAccessTime;
        updatedDetail.lastAccessedBy = fullName(updatedItem.deviceUser!.user!);
      }
    }
    if (deviceUser.lastConnectSpace) {
      updatedDetail.lastSpaceConnectedTo = deviceUser.lastConnectSpace?.spaceName || '';
      updatedItem.lastSpaceConnectedTo = deviceUser.lastConnectSpace?.spaceName || '';
    }

    return updatedDetail;
  }
}

const spaceDetail = (space: Space): SpaceDetail => {

  const {
    users
  } = space;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const connectWindow = now.setMinutes(now.getMinutes() - 10);

  let clientsConnected = 0;
  let bytesDownloaded = 0;
  let bytesUploaded = 0;

  const spaceUsers: SpaceUserListItem[] = [];
  users!.spaceUsers!.forEach(spaceUser => {
    spaceUsers.push(spaceUserListItem(spaceUser!));
    if (spaceUser!.status == UserAccessStatus.active) {
      if (space.status == SpaceStatus.running && spaceUser!.lastConnectTime! > connectWindow) {
        // *** NB: this needs to be streamed and not calculated ***
        clientsConnected++;
      }
      if (spaceUser!.lastConnectTime! >= startOfMonth) {
        // only add usage values for current month
        bytesDownloaded += spaceUser!.bytesDownloaded!;
        bytesUploaded += spaceUser!.bytesUploaded!;
      }
    }
  });

  return {
    name: space.spaceName!,
    status: space.status!,
    ownerAdmin: fullName(space.owner!),
    lastSeen: space.lastSeen && space.lastSeen > 0
      ? dateTimeToLocale(new Date(space.lastSeen), false)
      : 'never',
    clientsConnected,
    dataUsageIn: bytesToSize(bytesDownloaded),
    dataUsageOut: bytesToSize(bytesUploaded),
    cloudProvider: space.iaas!,
    type: space.recipe!,
    location: space.region!,
    version: space.version!,
    bytesDownloaded,
    bytesUploaded,
    users: spaceUsers
  };
}

const spaceUserListItem = (spaceUser: SpaceUser): SpaceUserListItem => {

  const {
    user,
    status,
    bytesUploaded,
    bytesDownloaded,
    lastConnectTime,
    lastConnectDevice
  } = spaceUser!;

  const {
    userID,
    userName
  } = user!;

  const dateTime = new Date(lastConnectTime || 0);

  return <SpaceUserListItem>{
    userID,
    userName,
    fullName: fullName(user!),
    status,
    dataUsageIn: bytesToSize(bytesDownloaded!),
    dataUsageOut: bytesToSize(bytesUploaded!),
    lastConnectTime: lastConnectTime && lastConnectTime > 0
      ? dateTimeToLocale(dateTime)
      : 'never',
    lastDeviceConnected: lastConnectDevice?.deviceName || '',
    spaceUser
  }
}

const updateSpaceDetail = (
  detail: SpaceDetail,
  space: Space
): SpaceDetail => {

  const updatedDetail = (({ updatedFields, ...d }) => <SpaceDetail>d)(detail);
  if (space.spaceName) {
    updatedDetail.name = space.spaceName!;
  }
  if (space.status) {
    updatedDetail.status = space.status!;
  }
  if (space.lastSeen && space.lastSeen > 0) {
    updatedDetail.lastSeen = dateTimeToLocale(new Date(space.lastSeen), false);
  }
  if (space.version) {
    updatedDetail.version = space.version!;
  }

  return updatedDetail;
}

const updateSpaceUserListItem = (
  detail: SpaceDetail,
  spaceUser: SpaceUser
): SpaceDetail | undefined => {

  const itemIndex = detail.users.findIndex(item => item.userID == spaceUser.user!.userID);
  if (itemIndex != -1) {

    // make copies of the detail and item that
    // will chang as part of this update
    const updatedDetail = (({
      updatedFields,
      users,
      ...d
    }) => <SpaceDetail>{
      ...d,
      users: [...users],
    })(detail);
    const updatedItem = (
      ({
        updatedFields,
        spaceUser,
        ...i
      }) => <SpaceUserListItem>{
        ...i,
        spaceUser: { ...spaceUser }
      }
    )(detail.users[itemIndex]);
    const [ item ] = updatedDetail.users.splice(itemIndex, 1, updatedItem);

    if (spaceUser.status) {
      updatedItem.status = spaceUser.status!;
      updatedItem.spaceUser!.status = spaceUser.status!;
    }
    if (spaceUser.bytesDownloaded) {
      updatedDetail.bytesDownloaded -= item.spaceUser!.bytesDownloaded!;
      updatedDetail.bytesDownloaded += spaceUser.bytesDownloaded;
      updatedDetail.dataUsageIn = bytesToSize(updatedDetail.bytesDownloaded);
      updatedItem.dataUsageIn = bytesToSize(spaceUser.bytesDownloaded!);
      updatedItem.spaceUser!.bytesDownloaded = spaceUser.bytesDownloaded
    }
    if (spaceUser.bytesUploaded) {
      updatedDetail.bytesUploaded -= item.spaceUser!.bytesUploaded!;
      updatedDetail.bytesUploaded += spaceUser.bytesUploaded;
      updatedDetail.dataUsageOut = bytesToSize(updatedDetail.bytesUploaded);
      updatedItem.dataUsageOut = bytesToSize(spaceUser.bytesUploaded!);
      updatedItem.spaceUser!.bytesUploaded = spaceUser.bytesUploaded
    }
    if (spaceUser.lastConnectTime) {
      const dateTime = new Date(spaceUser.lastConnectTime);
      updatedItem.lastConnectTime = dateTimeToLocale(dateTime);
    }
    if (spaceUser.lastConnectDevice) {
      updatedItem.lastDeviceConnected = spaceUser.lastConnectDevice?.deviceName || '';
    }

    return updatedDetail;
  }
}

const fullName: (user: User | UserRef) => string =
({
  firstName,
  middleName,
  familyName
}) => {
  return (firstName ? firstName + ' ': '') +
    (middleName ?
      middleName.length > 1
        ? middleName + ' '
        : middleName + '. '
      : '') +
    (familyName ? familyName : '');
}
