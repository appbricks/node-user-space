import * as redux from 'redux';
import { Epic } from 'redux-observable';

import {
  ErrorPayload,
  ResetStatusPayload,
  Action,
  reducerDelegate,
  Logger,
} from '@appbricks/utils';

import { Cursor } from '../model/types';

import Provider from './provider';

import * as state from './state';
import * as action from './action';

import { userSearchAction, userSearchEpic } from './actions/user-search';
import { getUserDevicesAction, getUserDevicesEpic } from './actions/get-user-devices';
import { getDeviceAccessRequestsAction, getDeviceAccessRequestsEpic } from './actions/get-device-access-requests';
import { activateUserOnDeviceAction, activateUserOnDeviceEpic } from './actions/activate-user-on-device';
import { deleteUserFromDeviceAction, deleteUserFromDeviceEpic } from './actions/delete-user-from-device';
import { deleteDeviceAction, deleteDeviceEpic } from './actions/delete-device';
import { getUserSpacesAction, getUserSpacesEpic } from './actions/get-user-spaces';
import { getSpaceInvitationsAction, getSpaceInvitationsEpic } from './actions/get-space-invitations';
import { inviteUserToSpaceAction, inviteUserToSpaceEpic } from './actions/invite-user-to-space';
import { removeUserAccessToSpaceAction, removeUserAccessToSpaceEpic } from './actions/remove-user-access-to-space';
import { deleteSpaceAction, deleteSpaceEpic } from './actions/delete-space';
import { acceptSpaceInvitationAction, acceptSpaceInvitationEpic } from './actions/accept-space-invitation';
import { leaveSpaceAction, leaveSpaceEpic } from './actions/leave-space';

export default class UserSpaceService {

  logger: Logger;

  csProvider: Provider;

  constructor(provider: Provider) {
    this.logger = new Logger('UserSpaceService');

    this.csProvider = provider;
  }

  static stateProps<S extends state.UserSpaceStateProps, C extends state.UserSpaceStateProps>(
    state: S, ownProps?: C): state.UserSpaceStateProps {

    return {
      userspace: state.userspace
    };
  }

  static dispatchProps<C extends state.UserSpaceStateProps>(
    dispatch: redux.Dispatch<redux.Action>, ownProps?: C): action.UserSpaceActionProps {

    return {
      userspaceService: {
        // user lookup actions
        userSearch: (namePrefix: string, limit?: number, cursor?: Cursor) => 
          userSearchAction(dispatch, namePrefix, limit, cursor),

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
      getUserDevicesEpic(this.csProvider),
      getDeviceAccessRequestsEpic(this.csProvider),
      activateUserOnDeviceEpic(this.csProvider),
      deleteUserFromDeviceEpic(this.csProvider),
      deleteDeviceEpic(this.csProvider),
      getUserSpacesEpic(this.csProvider),
      getSpaceInvitationsEpic(this.csProvider),
      inviteUserToSpaceEpic(this.csProvider),
      removeUserAccessToSpaceEpic(this.csProvider),
      deleteSpaceEpic(this.csProvider),
      acceptSpaceInvitationEpic(this.csProvider),
      leaveSpaceEpic(this.csProvider),
    ];
  }
}