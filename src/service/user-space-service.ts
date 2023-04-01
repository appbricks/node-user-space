import * as redux from 'redux';
import { Epic } from 'redux-observable';

const _ = require('lodash');

import {
  Action,
  reducerDelegate,
  Logger,
  dateTimeToLocale,
  bytesToSize
} from '@appbricks/utils';

import {
  vpnClientURLs
} from './constants';

import {
  UserRef,
  User,
  UserAccessStatus,
  Device,
  DeviceUser,
  Space,
  SpaceUser,
  SpaceStatus,
  App,
  AppStatus,
  AppUser,
  Key
} from '../model/types';

import {
  DisplayType,
  DeviceDetail,
  DeviceUserListItem,
  SpaceAccessConfig,
  SpaceDetail,
  SpaceUserListItem,
  AppDetail,
  AppUserListItem
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
import * as updateDevice from './actions/update-device';
import * as setDeviceSpaceAccessConfig from './actions/set-device-space-access-config';
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
import * as updateSpace from './actions/update-space';
import * as updateSpaceUser from './actions/update-space-user';
import * as getUserApps from './actions/get-user-apps';
import * as appUpdates from './actions/app-updates-subscription';
import * as appTelemetry from './actions/app-telemetry-subscription';
import * as grantUserAccessToApp from './actions/grant-user-access-to-app';
import * as removeUserAccessToApp from './actions/remove-user-access-to-app';
import * as deleteApp from './actions/delete-app';
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
  actions.SpaceIDPayload |
  actions.SpaceUserIDPayload |
  actions.SpaceInvitationPayload |
  actions.SpacePayload |
  actions.SpacesPayload |
  actions.SpaceUserPayload |
  actions.SpaceUsersPayload |
  actions.SpaceUpdateSubscriptionPayload |
  actions.SpaceTelemetrySubscriptionPayload |
  actions.AppIDPayload |
  actions.AppUserIDPayload |
  actions.AppPayload |
  actions.AppUserIDPayload |
  actions.AppUserPayload |
  actions.AppUsersPayload;

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
      .add(actions.GET_DEVICE_ACCESS_REQUESTS)
      .add(actions.ACTIVATE_USER_ON_DEVICE)
      .add(actions.DELETE_USER_FROM_DEVICE)
      .add(actions.DELETE_USER_FROM_SPACE)
      .add(actions.DELETE_DEVICE)
      .add(actions.UPDATE_DEVICE)
      .add(actions.SUBSCRIBE_TO_DEVICE_UPDATES)
      .add(actions.SUBSCRIBE_TO_DEVICE_TELEMETRY)
      .add(actions.UNSUBSCRIBE_FROM_DEVICE_UPDATES)
      .add(actions.SET_DEVICE_SPACE_ACCESS_CONFIG)
      .add(actions.GET_USER_SPACES)
      .add(actions.INVITE_USER_TO_SPACE)
      .add(actions.GRANT_USER_ACCESS_TO_SPACE)
      .add(actions.REMOVE_USER_ACCESS_TO_SPACE)
      .add(actions.DELETE_SPACE)
      .add(actions.SUBSCRIBE_TO_SPACE_UPDATES)
      .add(actions.SUBSCRIBE_TO_SPACE_TELEMETRY)
      .add(actions.UNSUBSCRIBE_FROM_SPACE_UPDATES)
      .add(actions.GET_SPACE_INVITATIONS)
      .add(actions.ACCEPT_SPACE_INVITATION)
      .add(actions.LEAVE_SPACE)
      .add(actions.UPDATE_SPACE)
      .add(actions.UPDATE_SPACE_USER)
      .add(actions.GET_USER_APPS)
      .add(actions.GRANT_USER_ACCESS_TO_APP)
      .add(actions.REMOVE_USER_ACCESS_TO_APP)
      .add(actions.DELETE_APP)
      .add(actions.SUBSCRIBE_TO_APP_UPDATES)
      .add(actions.SUBSCRIBE_TO_APP_TELEMETRY)
      .add(actions.UNSUBSCRIBE_FROM_APP_UPDATES)
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

        // device owner actions
        getUserDevices: () =>
          getUserDevices.action(dispatch),
        getDeviceAccessRequests: (deviceID: string) =>
          getDeviceAccessRequests.action(dispatch, deviceID),
        activateUserOnDevice: (deviceID: string, userID: string) =>
          activateUserOnDevice.action(dispatch, deviceID, userID),
        deleteUserFromDevice: (deviceID: string, userID?: string) =>
          deleteUserFromDevice.action(dispatch, deviceID, userID),
        deleteDevice: (deviceID: string) =>
          deleteDevice.action(dispatch, deviceID),
        updateDevice: (deviceID: string, deviceKey?: Key, clientVersion?: string, settings?: DisplayType) =>
          updateDevice.action(dispatch, deviceID, deviceKey, clientVersion, settings),
        unsubscribeFromDeviceUpdates: () => 
          deviceUpdates.unsubscribeAction(dispatch),
        setDeviceSpaceAccessConfig: (deviceID: string, spaceID: string, viewed: boolean) => 
          setDeviceSpaceAccessConfig.action(dispatch, deviceID, spaceID, viewed),

        // space owner actions
        getUserSpaces: () =>
          getUserSpaces.action(dispatch),
        inviteUserToSpace: (spaceID: string, userID: string, settings: actions.SpaceUserSettings) =>
          inviteUserToSpace.action(dispatch, spaceID, userID, settings),
        grantUserAccessToSpace: (spaceID: string, userID: string) =>
          grantUserAccessToSpace.action(dispatch, spaceID, userID),
        removeUserAccessToSpace: (spaceID: string, userID: string) =>
          removeUserAccessToSpace.action(dispatch, spaceID, userID),
        deleteUserFromSpace: (spaceID: string, userID?: string) =>
          deleteUserFromSpace.action(dispatch, spaceID, userID),
        deleteSpace: (spaceID: string) =>
          deleteSpace.action(dispatch, spaceID),
        updateSpace: (spaceID: string, deviceKey?: Key, version?: string, settings?: DisplayType) =>
          updateSpace.action(dispatch, spaceID, deviceKey, version, settings),
        updateSpaceUser: (spaceID: string, userID: string, settings: actions.SpaceUserSettings) =>
          updateSpaceUser.action(dispatch, spaceID, userID, settings),
        unsubscribeFromSpaceUpdates: () => 
          spaceUpdates.unsubscribeAction(dispatch),

        // space guest actions
        getSpaceInvitations: () =>
          getSpaceInvitations.action(dispatch),
        acceptSpaceInvitation: (spaceID: string) =>
          acceptSpaceInvitation.action(dispatch, spaceID),
        leaveSpace: (spaceID: string)  =>
          leaveSpace.action(dispatch, spaceID),

        // app owner actions
        getUserApps: () =>
          getUserApps.action(dispatch),
        grantUserAccessToApp: (appID: string, userID: string) => 
          grantUserAccessToApp.action(dispatch, appID, userID),
        removeUserAccessToApp: (appID: string, userID?: string) =>
          removeUserAccessToApp.action(dispatch, appID, userID),
        deleteApp: (appID: string) => 
          deleteApp.action(dispatch, appID),
        unsubscribeFromAppUpdates: () => 
          appUpdates.unsubscribeAction(dispatch)
      }
    }
  }

  epics(): Epic[] {
    return [
      userUpdates.subscribeEpic(this.csProvider),
      userSearch.epic(this.csProvider),
      getUserDevices.epic(this.csProvider),
      getDeviceAccessRequests.epic(this.csProvider),
      activateUserOnDevice.epic(this.csProvider),
      deleteUserFromDevice.epic(this.csProvider),
      deleteDevice.epic(this.csProvider),
      updateDevice.epic(this.csProvider),
      deviceUpdates.subscribeEpic(this.csProvider),
      deviceTelemetry.subscribeEpic(this.csProvider),
      deviceUpdates.unsubscribeEpic(this.csProvider),
      setDeviceSpaceAccessConfig.epic(this.csProvider),
      getUserSpaces.epic(this.csProvider),
      inviteUserToSpace.epic(this.csProvider),
      grantUserAccessToSpace.epic(this.csProvider),
      removeUserAccessToSpace.epic(this.csProvider),
      deleteUserFromSpace.epic(this.csProvider),
      deleteSpace.epic(this.csProvider),
      updateSpace.epic(this.csProvider),
      updateSpaceUser.epic(this.csProvider),
      spaceUpdates.subscribeEpic(this.csProvider),
      spaceTelemetry.subscribeEpic(this.csProvider),
      spaceUpdates.unsubscribeEpic(this.csProvider),
      getSpaceInvitations.epic(this.csProvider),
      acceptSpaceInvitation.epic(this.csProvider),
      leaveSpace.epic(this.csProvider),
      getUserApps.epic(this.csProvider),
      grantUserAccessToApp.epic(this.csProvider),
      removeUserAccessToApp.epic(this.csProvider),
      deleteApp.epic(this.csProvider),
      appUpdates.subscribeEpic(this.csProvider),
      appTelemetry.subscribeEpic(this.csProvider),
      appUpdates.unsubscribeEpic(this.csProvider),
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
        if (detail) {
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
        if (detail) {
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
        }
        break;
      }
      case actions.APP_UPDATE: {
        const app = (<actions.AppPayload>action.payload!).app;
        const detail = state.apps[app.appID!];
        if (detail) {
          state = {
            ...state,
            apps: {
              ...state.apps,
              [app.appID!]: updateAppDetail(detail, app)
            }
          }
        }
        break;
      }
      case actions.APP_TELEMETRY: {
        const appUser = (<actions.AppUserPayload>action.payload!).appUser;
        const detail = state.apps[appUser.app!.appID!];
        if (detail) {
          const updatedDetail = updateAppUserListItem(detail, appUser);
          if (updatedDetail) {
            state = {
              ...state,
              apps: {
                ...state.apps,
                [appUser.app!.appID!]: updatedDetail
              }
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
        userDevices.forEach(deviceUser => {
          devices[deviceUser.device!.deviceID!] = deviceDetail(deviceUser, state)
        })
        this.logger.trace('Current user\'s device collection: ', devices);

        return {
          ...state,
          deviceUpdatesActive: true,
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
      case actions.UNSUBSCRIBE_FROM_DEVICE_UPDATES: {
        state = {
          ...state,
          deviceUpdatesActive: false
        }
        break;
      }
      case actions.SET_DEVICE_SPACE_ACCESS_CONFIG: {
        const payload = <actions.DeviceSpaceAccessConfigPayload>relatedAction.payload!;
        const deviceID = payload.deviceID;
        const spaceID = payload.spaceID;
        const viewed = payload.viewed;

        const device = state.devices[deviceID];
        if (device) {
          state = {
            ...state,
            devices: {
                ...state.devices,
                [deviceID]: {
                    ...device,
                    spaceAccessConfigs: device.spaceAccessConfigs.map(
                      c => c.spaceID == spaceID
                        ? { ...c, viewed }
                        : { ... c }
                    )
                }
            }
          }
        }
        break;
      }
      case actions.GET_USER_SPACES: {
        const userSpaces = (<actions.SpaceUsersPayload>action.payload!).spaceUsers;
        this.logger.trace('Loaded current user\'s spaces', userSpaces);

        // build user lists for spaces owned by the current user
        const spaces: { [spaceID: string]: SpaceDetail } = {}
        userSpaces.forEach(spaceUser => {
          spaces[spaceUser.space!.spaceID!] = spaceDetail(spaceUser);
        })
        this.logger.trace('Created current user\'s space collection: ', spaces);

        return {
          ...state,
          spaceUpdatesActive: true,
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
      case actions.UNSUBSCRIBE_FROM_SPACE_UPDATES: {
        state = {
          ...state,
          spaceUpdatesActive: false
        }
        break;
      }
      case actions.GET_USER_APPS: {
        const userApps = (<actions.AppUsersPayload>action.payload!).appUsers;
        this.logger.trace('Loaded current user\'s apps', userApps);

        // build user lists for spaces owned by the current user
        const apps: { [appID: string]: AppDetail } = {}
        userApps.forEach(appUser => {
          apps[appUser.app!.appID!] = appDetail(appUser);
        })
        this.logger.trace('Created current user\'s space collection: ', apps);

        return {
          ...state,
          appUpdatesActive: true,
          userApps,
          apps
        }
      }
      case actions.UNSUBSCRIBE_FROM_APP_UPDATES: {
        state = {
          ...state,
          appUpdatesActive: false
        }
        break;
      }
    }

    return state;
  }
}

const deviceDetail = (deviceUser: DeviceUser, state: UserSpaceState): DeviceDetail => {

  const device = deviceUser.device!;
  const users = device.users!;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let lastAccessedTime = 0;
  let lastAccessedBy = '';
  let lastSpaceConnectedTo = '';
  let bytesDownloaded = 0;
  let bytesUploaded = 0;

  const deviceUsers: DeviceUserListItem[] = [];
  if (deviceUser.isOwner) {
    // enumerate device users for owned devices
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
          bytesDownloaded += parseInt(deviceUser!.bytesDownloaded!, 10);
          bytesUploaded += parseInt(deviceUser!.bytesUploaded!, 10);
        }
      }
    });  
  } else {
    lastAccessedTime = deviceUser.lastAccessTime!;
    lastSpaceConnectedTo = deviceUser.lastConnectSpace?.spaceName! || '';
    bytesDownloaded = parseInt(deviceUser.bytesDownloaded!, 10);
    bytesUploaded = parseInt(deviceUser.bytesUploaded!, 10);
  }

  const spaceAccessConfigs: SpaceAccessConfig[] = [];
  if (deviceUser.spaceConfigs) {
    // enumerate space configs for device user
    deviceUser.spaceConfigs.forEach(spaceConfig => {

      const spaceID = spaceConfig!.space!.spaceID!;
      const userSpace = state.userSpaces.find(us => us.space!.spaceID == spaceID);
      
      if (userSpace) {
        const space = userSpace!.space!;
        const expireAt = spaceConfig!.wgConfigExpireAt || 0;
        const inactivityExpireAt = spaceConfig!.wgInactivityExpireAt || 0;
        spaceAccessConfigs.push({
          spaceID,
          spaceName: space.spaceName!,
          vpnType: space.vpnType!,
          vpnURL: vpnClientURLs[space.vpnType!] || '',
          wgConfig: spaceConfig!.wgConfig!,
          viewed: !!spaceConfig!.viewed,
          expireAt: dateTimeToLocale(new Date(expireAt)),
          inactivityExpireAt: dateTimeToLocale(new Date(inactivityExpireAt)),
          isExpired: Date.now() > expireAt
        });
      }
    });
  }

  const lastAccessedDataTime = new Date(lastAccessedTime || 0);

  return {
    deviceID: device.deviceID!,
    name: device.deviceName!,
    accessStatus: deviceUser.status!,
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
    settings: device.settings ? JSON.parse(device.settings) : {},
    isOwned: deviceUser.isOwner!,
    bytesDownloaded,
    bytesUploaded,
    lastAccessedTime,
    users: deviceUsers,
    spaceAccessConfigs
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
    dataUsageIn: bytesToSize(parseInt(bytesDownloaded!, 10)),
    dataUsageOut: bytesToSize(parseInt(bytesUploaded!, 10)),
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

  const updatedDetail = { ...detail };
  if (device.deviceName) {
    updatedDetail.name = device.deviceName!;
  }
  if (device.deviceType) {
    updatedDetail.type = device.deviceType!;
  }
  if (device.clientVersion) {
    updatedDetail.version = device.clientVersion!;
  }
  if (device.settings) {
    updatedDetail.settings = JSON.parse(device.settings);
  }

  return updatedDetail;
}

const updateDeviceUserListItem = (
  detail: DeviceDetail,
  deviceUser: DeviceUser
): DeviceDetail | undefined => {

  // make copy of the device detail that
  // will change as part of this update
  const updatedDetail = (({
    users,
    ...d
  }) => <DeviceDetail>{
    ...d,
    users: [...users],
  })(detail);
  
  if (updatedDetail.isOwned) {
    const itemIndex = detail.users.findIndex(item => item.userID == deviceUser.user!.userID);
    if (itemIndex != -1) {
  
      // make copy of the user list item that
      // will change as part of this update
      const updatedItem = (
        ({
          deviceUser: du,
          ...i
        }) => <DeviceUserListItem>{
          ...i,
          deviceUser: <DeviceUser>_.mergeWith(
            _.cloneDeep(du), 
            _.cloneDeep(deviceUser), 
            (o: any, s: any) => _.isObject(o) 
              ? _.mergeWith(o, s) // recursive merge object props
              : _.isNull(s) ? o : s
          )
        }
      )(detail.users[itemIndex]);
      const [ item ] = updatedDetail.users.splice(itemIndex, 1, updatedItem);
  
      if (deviceUser.status) {
        if (deviceUser.isOwner) {
          updatedDetail.accessStatus = deviceUser.status;
        }
        updatedItem.status = deviceUser.status!;
      }
      if (deviceUser.bytesDownloaded) {
        let bytesDownloaded = parseInt(deviceUser.bytesDownloaded, 10);
        updatedDetail.bytesDownloaded -= parseInt(item.deviceUser!.bytesDownloaded!, 10);
        updatedDetail.bytesDownloaded += bytesDownloaded;
        updatedDetail.dataUsageIn = bytesToSize(updatedDetail.bytesDownloaded);
        updatedItem.dataUsageIn = bytesToSize(bytesDownloaded);
      }
      if (deviceUser.bytesUploaded) {
        let bytesUploaded = parseInt(deviceUser.bytesUploaded, 10);
        updatedDetail.bytesUploaded -= parseInt(item.deviceUser!!.bytesUploaded!, 10);
        updatedDetail.bytesUploaded += bytesUploaded;
        updatedDetail.dataUsageOut = bytesToSize(updatedDetail.bytesUploaded);
        updatedItem.dataUsageOut = bytesToSize(bytesUploaded);
      }
      if (deviceUser.lastAccessTime) {
        const dateTime = new Date(deviceUser.lastAccessTime);
        updatedItem.lastAccessTime = dateTimeToLocale(dateTime);
        if (deviceUser.lastAccessTime > detail.lastAccessedTime) {
          updatedDetail.lastAccessedTime = deviceUser.lastAccessTime;
          updatedDetail.lastAccessed = dateTimeToLocale(dateTime, false);
          updatedDetail.lastAccessedBy = fullName(updatedItem.deviceUser!.user!);
        }
      }
      if (deviceUser.lastConnectSpace) {
        updatedDetail.lastSpaceConnectedTo = deviceUser.lastConnectSpace?.spaceName || '';
        updatedItem.lastSpaceConnectedTo = deviceUser.lastConnectSpace?.spaceName || '';
      }  
    }

  } else {
    if (deviceUser.status) {
      updatedDetail.accessStatus = deviceUser.status;
    }
    if (deviceUser.bytesDownloaded) {
      updatedDetail.bytesDownloaded = parseInt(deviceUser.bytesDownloaded, 10);
      updatedDetail.dataUsageIn = bytesToSize(updatedDetail.bytesDownloaded);
    }
    if (deviceUser.bytesUploaded) {
      updatedDetail.bytesUploaded = parseInt(deviceUser.bytesUploaded, 10);
      updatedDetail.dataUsageOut = bytesToSize(updatedDetail.bytesUploaded);
    }
    if (deviceUser.lastAccessTime) {
      updatedDetail.lastAccessedTime = deviceUser.lastAccessTime;
      updatedDetail.lastAccessed = dateTimeToLocale(new Date(deviceUser.lastAccessTime), false);
    }
    if (deviceUser.lastConnectSpace) {
      updatedDetail.lastSpaceConnectedTo = deviceUser.lastConnectSpace?.spaceName || '';
    }
  }

  return updatedDetail;
}

const spaceDetail = (spaceUser: SpaceUser): SpaceDetail => {

  const space = spaceUser.space!;
  const users = space.users!;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const connectWindow = now.setMinutes(now.getMinutes() - 10);

  let clientsConnected = 0;
  let bytesDownloaded = 0;
  let bytesUploaded = 0;

  const spaceUsers: SpaceUserListItem[] = [];
  if (spaceUser.isOwner) {
    // enumerate space users for owned spaces
    users!.spaceUsers!.forEach(spaceUser => {
      spaceUsers.push(spaceUserListItem(spaceUser!));
      if (spaceUser!.status == UserAccessStatus.active) {
        if (space.status == SpaceStatus.running && spaceUser!.lastConnectTime! > connectWindow) {
          // *** NB: this needs to be streamed and not calculated ***
          clientsConnected++;
        }
        if (spaceUser!.lastConnectTime! >= startOfMonth) {
          // only add usage values for current month
          bytesDownloaded += parseInt(spaceUser!.bytesDownloaded!, 10);
          bytesUploaded += parseInt(spaceUser!.bytesUploaded!, 10);
        }
      }
    });  
  } else {
    bytesDownloaded = parseInt(spaceUser.bytesDownloaded!, 10);
    bytesUploaded = parseInt(spaceUser.bytesUploaded!, 10);
  }

  // if space status is running but it was last seen 
  // over 5 minutes ago then set status to unknown
  let status = space.status!;
  let lastSeen = 'never';

  const spaceLastSeen = space.lastSeen;
  if (spaceLastSeen && spaceLastSeen > 0) {
    lastSeen = dateTimeToLocale(new Date(spaceLastSeen), false)
    
    if ( status == SpaceStatus.running && 
      spaceLastSeen < (Date.now() - 300000 /* <5m */) ) {      
      status = SpaceStatus.unknown;
    } 
  }

  return {
    spaceID: space.spaceID!,
    name: space.spaceName!,
    accessStatus: spaceUser.status!,
    status,
    ownerAdmin: fullName(space.owner!),
    lastSeen,
    clientsConnected,
    dataUsageIn: bytesToSize(bytesUploaded),
    dataUsageOut: bytesToSize(bytesDownloaded),
    cloudProvider: space.iaas!,
    type: space.recipe!,
    location: space.region!,
    version: space.version!,
    spaceDefaults: 
      space.settings 
        ? JSON.parse(space.settings) 
        : { 
            isSpaceAdmin: false,
            canUseSpaceForEgress: false,
            enableSiteBlocking: false
          },
    isOwned: spaceUser.isOwner!,
    isEgressNode: space.isEgressNode!,
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
    egressAllowed: spaceUser.canUseSpaceForEgress ? 'yes' : 'no',
    dataUsageIn: bytesToSize(parseInt(bytesDownloaded!, 10)),
    dataUsageOut: bytesToSize(parseInt(bytesUploaded!, 10)),
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

  const updatedDetail = { ...detail };
  if (space.spaceName) {
    updatedDetail.name = space.spaceName!;
  }
  if (space.version) {
    updatedDetail.version = space.version!;
  }
  if (space.isEgressNode != null) {
    updatedDetail.isEgressNode = space.isEgressNode!;
  }
  if (space.settings) {
    updatedDetail.spaceDefaults = JSON.parse(space.settings);
  }
  if (space.status) {
    updatedDetail.status = space.status!;
  }
  if (space.lastSeen && space.lastSeen > 0) {
    updatedDetail.lastSeen = dateTimeToLocale(new Date(space.lastSeen), false);
  }

  return updatedDetail;
}

const updateSpaceUserListItem = (
  detail: SpaceDetail,
  spaceUser: SpaceUser
): SpaceDetail | undefined => {

  // make copies of the space detail that
  // will change as part of this update
  const updatedDetail = (({
    users,
    ...d
  }) => <SpaceDetail>{
    ...d,
    users: [...users],
  })(detail);

  if (updatedDetail.isOwned) {
    const itemIndex = detail.users.findIndex(item => item.userID == spaceUser.user!.userID);
    if (itemIndex != -1) {
  
      // make copy of the user list item that
      // will change as part of this update
      const updatedItem = (
        ({
          spaceUser: su,
          ...i
        }) => <SpaceUserListItem>{
          ...i,
          spaceUser: <SpaceUser>_.mergeWith(
            _.cloneDeep(su),
            _.cloneDeep(spaceUser),
            (o: any, s: any) => _.isObject(o) 
              ? _.mergeWith(o, s) // recursive merge object props
              : _.isNull(s) ? o : s
          )
        }
      )(detail.users[itemIndex]);
      const [ item ] = updatedDetail.users.splice(itemIndex, 1, updatedItem);
  
      if (spaceUser.status) {
        if (spaceUser.isOwner) {
          updatedDetail.accessStatus = spaceUser.status;
        }
        updatedItem.status = spaceUser.status!;
      }
      if (spaceUser.canUseSpaceForEgress !== undefined && spaceUser.canUseSpaceForEgress !== null) {
        updatedItem.egressAllowed = spaceUser.canUseSpaceForEgress ? 'yes' : 'no';
      }
      if (spaceUser.bytesDownloaded) {
        let bytesDownloaded = parseInt(spaceUser.bytesDownloaded, 10);
        updatedDetail.bytesDownloaded -= parseInt(item.spaceUser!.bytesDownloaded!, 10);
        updatedDetail.bytesDownloaded += bytesDownloaded;
        updatedDetail.dataUsageOut = bytesToSize(updatedDetail.bytesDownloaded);
        updatedItem.dataUsageOut = bytesToSize(bytesDownloaded);
      }
      if (spaceUser.bytesUploaded) {
        let bytesUploaded = parseInt(spaceUser.bytesUploaded, 10);
        updatedDetail.bytesUploaded -= parseInt(item.spaceUser!.bytesUploaded!, 10);
        updatedDetail.bytesUploaded += bytesUploaded;
        updatedDetail.dataUsageIn = bytesToSize(updatedDetail.bytesUploaded);
        updatedItem.dataUsageIn = bytesToSize(bytesUploaded);
      }
      if (spaceUser.lastConnectTime) {
        const dateTime = new Date(spaceUser.lastConnectTime);
        updatedItem.lastConnectTime = dateTimeToLocale(dateTime);
      }
      if (spaceUser.lastConnectDevice) {
        updatedItem.lastDeviceConnected = spaceUser.lastConnectDevice?.deviceName || '';
      }  
    }

  } else {
    if (spaceUser.status) {
      updatedDetail.accessStatus = spaceUser.status;
    }
    if (spaceUser.canUseSpaceForEgress !== undefined && spaceUser.canUseSpaceForEgress !== null) {
      updatedDetail.egressAllowed = spaceUser.canUseSpaceForEgress ? 'yes' : 'no';
    }
    if (spaceUser.bytesDownloaded) {
      updatedDetail.bytesDownloaded = parseInt(spaceUser.bytesDownloaded, 10);
      updatedDetail.dataUsageOut = bytesToSize(updatedDetail.bytesDownloaded);
    }
    if (spaceUser.bytesUploaded) {
      updatedDetail.bytesUploaded = parseInt(spaceUser.bytesUploaded, 10);
      updatedDetail.dataUsageIn = bytesToSize(updatedDetail.bytesUploaded);
    }
  }

  return updatedDetail;
}

const appDetail = (appUser: AppUser): AppDetail => {

  const app = appUser.app!;
  const users = app.users!;

  const appUsers: AppUserListItem[] = [];
  if (appUser.isOwner) {
    // enumerate app users for owned apps
    users!.appUsers!.forEach(appUser => {
      appUsers.push(appUserListItem(appUser!));
    });  
  }

  // if app status is running but it was last seen 
  // over 5 minutes ago then set status to unknown
  let status = app.status!;
  let lastSeen = 'never';

  const appLastSeen = app.lastSeen;
  if (appLastSeen && appLastSeen > 0) {
    lastSeen = dateTimeToLocale(new Date(appLastSeen), false)
    
    if ( status == AppStatus.running && 
      appLastSeen < (Date.now() - 300000 /* <5m */) ) {      
      status = AppStatus.unknown;
    } 
  }

  return {
    appID: app.appID!,
    name: app.appName!,
    status,
    lastSeen,
    installedSpace: app.space ? app.space!.spaceName! : "",
    spaceOwner: app.space ? fullName(app.space!.owner!): "",
    version: app.version!,
    description: app.description!,
    domainName: app.domainName!,
    ports: !app.port || app.port == 0 ? "" : app.port!.toString(),
    isOwned: appUser.isOwner!,
    users: appUsers
  };
}

const appUserListItem = (appUser: AppUser): AppUserListItem => {

  const {
    user,
    lastAccessedTime
  } = appUser!;

  const {
    userID,
    userName
  } = user!;

  return <AppUserListItem>{
    userID,
    userName,
    fullName: fullName(user!),
    lastAccessedTime: lastAccessedTime && lastAccessedTime > 0
      ? dateTimeToLocale(new Date(lastAccessedTime))
      : 'never',
    appUser
  }
}

const updateAppDetail = (
  detail: AppDetail,
  app: App
): AppDetail => {

  const updatedDetail = { ...detail };
  if (app.appName) {
    updatedDetail.name = app.appName!;
  }
  if (app.version) {
    updatedDetail.version = app.version!;
  }
  if (app.status) {
    updatedDetail.status = app.status!;
  }
  if (app.lastSeen && app.lastSeen > 0) {
    updatedDetail.lastSeen = dateTimeToLocale(new Date(app.lastSeen), false);
  }

  return updatedDetail;
}

const updateAppUserListItem = (
  detail: AppDetail,
  appUser: AppUser
): AppDetail | undefined => {

  // make copies of the space detail that
  // will change as part of this update
  const updatedDetail = (({
    users,
    ...d
  }) => <AppDetail>{
    ...d,
    users: [...users],
  })(detail);

  if (updatedDetail.isOwned) {
    const itemIndex = detail.users.findIndex(item => item.userID == appUser.user!.userID);
    if (itemIndex != -1) {

      // make copy of the user list item that
      // will change as part of this update
      const updatedItem = (
        ({
          appUser: au,
          ...i
        }) => <AppUserListItem>{
          ...i,
          appUser: <AppUser>_.mergeWith(
            _.cloneDeep(au),
            _.cloneDeep(appUser),
            (o: any, s: any) => _.isNull(s) ? o : s
          )
        }
      )(detail.users[itemIndex]);
      const [ item ] = updatedDetail.users.splice(itemIndex, 1, updatedItem);

      if (appUser.lastAccessedTime) {
        const dateTime = new Date(appUser.lastAccessedTime);
        updatedItem.lastAccessedTime = dateTimeToLocale(dateTime);
      }
    }
  }

  return updatedDetail;
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
