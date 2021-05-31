import * as redux from 'redux';
import { Epic } from 'redux-observable';

import {
  ErrorPayload,
  ResetStatusPayload,
  Action,
  reducerDelegate,
  Logger,
  bytesToSize
} from '@appbricks/utils';

import { 
  UserSearchItem
} from '../model/types';

import {
  SpaceUserListItem
} from '../model/lists';

import Provider from './provider';

import {
  UserSpaceState,
  UserSpaceStateProps,
  initialUserSpaceState
} from './state';
import {
  UserSearchPayload,
  UserSearchResultPayload,
  DeviceUserIDPayload,
  DeviceIDPayload,
  DevicesPayload,
  DevicePayload,
  DeviceUserPayload,
  DeviceUsersPayload,
  SpaceUserIDPayload,
  SpaceIDPayload,
  SpaceInvitationPayload,
  SpacesPayload,
  SpacePayload,
  SpaceUserPayload,
  SpaceUsersPayload,
  UserSpaceActionProps,
  USER_SEARCH,
  USER_SEARCH_PAGE_PREV,
  USER_SEARCH_PAGE_NEXT,
  CLEAR_USER_SEARCH_RESULTS,
  GET_USER_DEVICES,
  GET_DEVICE_ACCESS_REQUESTS,
  ACTIVATE_USER_ON_DEVICE,
  DELETE_USER_FROM_DEVICE,
  DELETE_USER_FROM_SPACE,
  DELETE_DEVICE,
  GET_USER_DEVICE_TELEMETRY,
  GET_USER_SPACES,
  INVITE_USER_TO_SPACE,
  GRANT_USER_ACCESS_TO_SPACE,
  REMOVE_USER_ACCESS_TO_SPACE,
  DELETE_SPACE,
  GET_USER_SPACE_TELEMETRY,
  GET_SPACE_INVITATIONS,
  ACCEPT_SPACE_INVITATION,
  LEAVE_SPACE,
  GET_USER_APPS,
  GET_APP_INVITATIONS,
  GET_USER_APP_TELEMETRY,
} from './action';

import { userSearchAction, userSearchEpic } from './actions/user-search';
import { userSearchPagePrevAction, userSearchPagePrevEpic } from './actions/user-search-page-prev';
import { userSearchPageNextAction, userSearchPageNextEpic } from './actions/user-search-page-next';
import { clearUserSearchResultsAction } from './actions/clear-user-search-results';
import { getUserDevicesAction, getUserDevicesEpic } from './actions/get-user-devices';
import { getDeviceAccessRequestsAction, getDeviceAccessRequestsEpic } from './actions/get-device-access-requests';
import { activateUserOnDeviceAction, activateUserOnDeviceEpic } from './actions/activate-user-on-device';
import { deleteUserFromDeviceAction, deleteUserFromDeviceEpic } from './actions/delete-user-from-device';
import { deleteDeviceAction, deleteDeviceEpic } from './actions/delete-device';
import { getUserSpacesAction, getUserSpacesEpic } from './actions/get-user-spaces';
import { getSpaceInvitationsAction, getSpaceInvitationsEpic } from './actions/get-space-invitations';
import { inviteUserToSpaceAction, inviteUserToSpaceEpic } from './actions/invite-user-to-space';
import { grantUserAccessToSpaceAction, grantUserAccessToSpaceEpic } from './actions/grant-user-access-to-space';
import { removeUserAccessToSpaceAction, removeUserAccessToSpaceEpic } from './actions/remove-user-access-to-space';
import { deleteUserFromSpaceAction, deleteUserFromSpaceEpic } from './actions/delete-user-from-space';
import { deleteSpaceAction, deleteSpaceEpic } from './actions/delete-space';
import { acceptSpaceInvitationAction, acceptSpaceInvitationEpic } from './actions/accept-space-invitation';
import { leaveSpaceAction, leaveSpaceEpic } from './actions/leave-space';

type UserSpacePayload =
  UserSearchPayload |
  UserSearchResultPayload |
  DeviceUserIDPayload |
  DeviceIDPayload |
  DevicesPayload |
  DevicePayload |
  DeviceUserPayload |
  DeviceUsersPayload |
  SpaceUserIDPayload |
  SpaceIDPayload |
  SpaceInvitationPayload |
  SpacesPayload |
  SpacePayload |
  SpaceUserPayload |
  SpaceUsersPayload; 

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
      .add(USER_SEARCH)
      .add(GET_USER_DEVICES)
      .add(GET_DEVICE_ACCESS_REQUESTS)
      .add(ACTIVATE_USER_ON_DEVICE)
      .add(DELETE_USER_FROM_DEVICE)
      .add(DELETE_USER_FROM_SPACE)
      .add(DELETE_DEVICE)
      .add(GET_USER_DEVICE_TELEMETRY)
      .add(GET_USER_SPACES)
      .add(INVITE_USER_TO_SPACE)
      .add(GRANT_USER_ACCESS_TO_SPACE)
      .add(REMOVE_USER_ACCESS_TO_SPACE)
      .add(DELETE_SPACE)
      .add(GET_USER_SPACE_TELEMETRY)
      .add(GET_SPACE_INVITATIONS)
      .add(ACCEPT_SPACE_INVITATION)
      .add(LEAVE_SPACE)
      .add(GET_USER_APPS)
      .add(GET_APP_INVITATIONS)
      .add(GET_USER_APP_TELEMETRY)
  }

  static stateProps<S extends UserSpaceStateProps, C extends UserSpaceStateProps>(
    state: S, ownProps?: C): UserSpaceStateProps {

    return {
      userspace: state.userspace
    };
  }

  static dispatchProps<C extends UserSpaceStateProps>(
    dispatch: redux.Dispatch<redux.Action>, ownProps?: C): UserSpaceActionProps {

    return {
      userspaceService: {
        // user lookup actions
        userSearch: (namePrefix: string, limit?: number) => 
          userSearchAction(dispatch, namePrefix, limit),
        userSearchPagePrev: () =>
          userSearchPagePrevAction(dispatch),
        userSearchPageNext: () =>
          userSearchPageNextAction(dispatch),
        clearUserSearchResults: () =>
          clearUserSearchResultsAction(dispatch),

        // device owner actions
        getUserDevices: () => 
          getUserDevicesAction(dispatch),
        getDeviceAccessRequests: (deviceID: string) => 
          getDeviceAccessRequestsAction(dispatch, deviceID),
        activateUserOnDevice: (deviceID: string, userID: string) => 
          activateUserOnDeviceAction(dispatch, deviceID, userID),
        deleteUserFromDevice: (deviceID: string, userID: string) => 
          deleteUserFromDeviceAction(dispatch, deviceID, userID),
        deleteDevice: (deviceID: string) => 
          deleteDeviceAction(dispatch, deviceID),
        subscribeUserDeviceTelemetry: (deviceID: string) => 
          dispatch({type: undefined}),
        unsubscribeUserDeviceTelemetry: (deviceID: string) => 
          dispatch({type: undefined}),
        
        // space owner actions
        getUserSpaces: () => 
          getUserSpacesAction(dispatch),
        inviteUserToSpace: (spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean) =>
          inviteUserToSpaceAction(dispatch, spaceID, userID, isAdmin, isEgressNode),
        deleteUserFromSpace: (spaceID: string, userID: string) => 
          deleteUserFromSpaceAction(dispatch, spaceID, userID),
        grantUserAccessToSpace: (spaceID: string, userID: string) => 
          grantUserAccessToSpaceAction(dispatch, spaceID, userID),
        removeUserAccessToSpace: (spaceID: string, userID: string) => 
          removeUserAccessToSpaceAction(dispatch, spaceID, userID),
        deleteSpace: (spaceID: string) => 
          deleteSpaceAction(dispatch, spaceID),
        subscribeUserSpaceTelemetry: (spaceID: string) => 
          dispatch({type: undefined}),
        unsubscribeUserSpaceTelemetry: (spaceID: string) => 
          dispatch({type: undefined}),
        
        // space guest actions 
        getSpaceInvitations: () => 
          getSpaceInvitationsAction(dispatch),
        acceptSpaceInvitation: (spaceID: string) => 
          acceptSpaceInvitationAction(dispatch, spaceID),
        leaveSpace: (spaceID: string)  => 
          leaveSpaceAction(dispatch, spaceID),

        // app owner actions
        getUserApps: () => 
          dispatch({type: undefined}),
        getAppInvitations: () =>  
          dispatch({type: undefined}),
        subscribeUserAppTelemetry: (appID: string) => 
          dispatch({type: undefined}),
        unsubscribeUserAppTelemetry: (appID: string) => 
          dispatch({type: undefined})
      }
    }
  }

  epics(): Epic[] {
    return [
      userSearchEpic(this.csProvider),
      userSearchPagePrevEpic(),
      userSearchPageNextEpic(),
      getUserDevicesEpic(this.csProvider),
      getDeviceAccessRequestsEpic(this.csProvider),
      activateUserOnDeviceEpic(this.csProvider),
      deleteUserFromDeviceEpic(this.csProvider),
      deleteDeviceEpic(this.csProvider),
      getUserSpacesEpic(this.csProvider),
      getSpaceInvitationsEpic(this.csProvider),
      inviteUserToSpaceEpic(this.csProvider),
      grantUserAccessToSpaceEpic(this.csProvider),
      removeUserAccessToSpaceEpic(this.csProvider),
      deleteUserFromSpaceEpic(this.csProvider),
      deleteSpaceEpic(this.csProvider),
      acceptSpaceInvitationEpic(this.csProvider),
      leaveSpaceEpic(this.csProvider),
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
      case CLEAR_USER_SEARCH_RESULTS: {
        state = {
          ...state,
          userSearchResult: undefined
        }
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
      case USER_SEARCH: {
        const searchArgs = <UserSearchPayload>relatedAction.payload!; 
        const searchResult = <UserSearchResultPayload>action.payload!;

        return {
          ...state,
          userSearchResult: {
            result: <UserSearchItem[]>searchResult.userSearchResult.users,

            searchPrefix: searchArgs.namePrefix,
            limit: searchArgs.limit!,
            pageInfo: searchResult.userSearchResult.pageInfo!
          }
        }
      }
      case GET_USER_DEVICES: {
        const userDevices = (<DeviceUsersPayload>action.payload!).deviceUsers;
        
        return {
          ...state,
          userDevices
        }
      }
      case GET_DEVICE_ACCESS_REQUESTS: {
        const deviceID = (<DeviceIDPayload>relatedAction.payload!).deviceID;
        const deviceUsers = (<DeviceUsersPayload>action.payload!).deviceUsers;

        const deviceAccessRequests = state.deviceAccessRequests || {};
        deviceAccessRequests[deviceID] = deviceUsers;
        return {
          ...state,
          deviceAccessRequests
        }
      }
      case GET_USER_SPACES: {
        const userSpaces = (<SpaceUsersPayload>action.payload!).spaceUsers;
        this.logger.trace('Loaded current user\'s spaces', userSpaces);

        // build user lists for spaces owned by the current user
        const spaceUsers: { [spaceID: string]: SpaceUserListItem[] } = {}
        userSpaces.forEach((spaceUser, i) => {
          if (spaceUser.isOwner) {

            spaceUsers[spaceUser.space!.spaceID!] = spaceUser.space!.users!.spaceUsers!
              .filter(spaceUser => !spaceUser!.isOwner)
              .map(spaceUser => {

                const {
                  user,
                  status,
                  bytesUploaded,
                  bytesDownloaded,
                  lastConnectTime
                } = spaceUser!;
                
                const {
                  userID,
                  userName,
                  firstName,
                  middleName,
                  familyName
                } = user!;

                let fullName = 
                  (firstName ? firstName + ' ': '') +
                  (middleName ? 
                    middleName.length > 1 
                      ? middleName + ' '
                      : middleName + '. '
                    : '') +
                  (familyName ? familyName : '');

                const dateTime = new Date(lastConnectTime || 0);

                return <SpaceUserListItem>{
                  userID,
                  userName,
                  fullName,
                  status,
                  bytesUploaded: bytesToSize(bytesUploaded!),
                  bytesDownloaded: bytesToSize(bytesDownloaded!),
                  lastConnectTime: lastConnectTime && lastConnectTime > 0
                    ? dateTime.toLocaleDateString() + ' ' + 
                      dateTime.toLocaleTimeString('en-US', { hour12: false, timeZoneName: 'short' })
                    : 'never'
                }
              });
          }
        })
        this.logger.trace('Created current user\'s space user lists: ', spaceUsers);

        return {
          ...state,
          userSpaces,
          spaceUsers
        }
      }
      case GET_SPACE_INVITATIONS: {
        const spaceInvitations = (<SpaceUsersPayload>action.payload!).spaceUsers;

        return {
          ...state,
          spaceInvitations
        }
      }
    }

    return state;
  }
}