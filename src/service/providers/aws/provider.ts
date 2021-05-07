import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';

import {
  Logger,
  Error
} from '@appbricks/utils';

import ProviderInterface from '../../provider';

import {
  UserSearchConnection,
  User,
  DeviceUser,
  SpaceUser,
  CursorInput
} from '../../../model/types';

import {
  ERROR_USER_SEARCH,
  ERROR_GET_USER_DEVICES,
  ERROR_GET_DEVICE_ACCESS_REQUESTS,
  ERROR_ACTIVATE_DEVICE_USER,
  ERROR_DELETE_DEVICE_USER,
  ERROR_GET_USER_SPACES,
  ERROR_INVITE_SPACE_USER,
  ERROR_DEACTIVATE_SPACE_USER,
  ERROR_DELETE_SPACE_USER,
  ERROR_DELETE_SPACE,
  ERROR_GET_SPACE_INVITATIONS,
  ERROR_ACCEPT_SPACE_USER_INVITATION,
  ERROR_LEAVE_SPACE_USER
} from '../../constants';

/**
 * AWS AppSync User-Space API provider.
 */
export default class Provider implements ProviderInterface {

  private logger: Logger;

  constructor() {
    this.logger = new Logger('AwsUserSpaceProvider');
  }

  async userSearch(namePrefix: string, limit?: number, cursor?: CursorInput) {

    const userSearchQuery = /* GraphQL */ `
      query UserSearch(
        $namePrefix: String!
        $limit: Int
        $next: CursorInput
      ) {
        userSearch(filter: {userName: {beginsWith: $namePrefix}}, limit: $limit, next: $next) {
          pageInfo {
            hasNextPage
            hasPreviousePage
            cursor {
              index
              nextTokens
            }
          }
          totalCount
          users {
            userID
            userName
          }
          edges {
            node {
              userID
              userName
            }
          }
        }
      }`;

    try {
      const result = <GraphQLResult<{ userSearch: UserSearchConnection }>>
        await API.graphql(
          graphqlOperation(userSearchQuery, { namePrefix, limit, cursor })
        );
      if (result.data) {
        const userSearch = result.data.userSearch
        this.logger.debug('User search results:', userSearch);
        return userSearch;
      } else {
        throw this.handleErrorResponse(result, ERROR_USER_SEARCH, 'userSearch')
      }

    } catch (error) {
      this.logger.error('userSearch API call returned error: ', error);
      throw new Error(ERROR_USER_SEARCH, error);
    }
  }

  async getUserDevices() {

    const getUser = /* GraphQL */ `
      query GetUser {
        getUser {
          devices {
            totalCount
            deviceUsers {
              isOwner
              status
              device {
                deviceID
                deviceName
                certificate
                users {
                  totalCount
                  deviceUsers {
                    user {
                      userID
                      userName
                    }
                  }
                }
              }
            }
          }
        }
      }`;

    try {
      const result = <GraphQLResult<{ getUser: User }>>
        await API.graphql(
          graphqlOperation(getUser)
        );
      if (result.data) {
        const deviceUsers = <DeviceUser[]>result.data.getUser.devices!.deviceUsers!;
        this.logger.debug('Retrieved user\'s devices:', deviceUsers);
        return deviceUsers;
      } else {
        throw this.handleErrorResponse(result, ERROR_GET_USER_DEVICES, 'getUserDevices')
      }

    } catch (error) {
      this.logger.error('getUserDevices API call returned error: ', error);
      throw new Error(ERROR_GET_USER_DEVICES, error);
    }
  }

  async getDeviceAccessRequests(deviceID: string) {

    const getDeviceAccessRequests = /* GraphQL */ `
      query GetDeviceAccessRequests($deviceID: ID!) {
        getDeviceAccessRequests(deviceID: $deviceID) {
          user {
            userID
            userName
          }
        }
      }`;

    try {
      const result = <GraphQLResult<{ getDeviceAccessRequests: DeviceUser[] }>>
        await API.graphql(
          graphqlOperation(getDeviceAccessRequests, { deviceID })
        );
      if (result.data) {
        const deviceUsers = <DeviceUser[]>result.data.getDeviceAccessRequests!;
        this.logger.debug('Retrieved user\'s device access requests:', deviceUsers);
        return deviceUsers;
      } else {
        throw this.handleErrorResponse(result, ERROR_GET_DEVICE_ACCESS_REQUESTS, 'getDeviceAccessRequests')
      }

    } catch (error) {
      this.logger.error('getDeviceAccessRequests API call returned error: ', error);
      throw new Error(ERROR_GET_DEVICE_ACCESS_REQUESTS, error);
    }
  }

  async activateDeviceUser(deviceID: string, userID: string) {

    const activateDeviceUser = /* GraphQL */ `
      mutation ActivateDeviceUser($deviceID: ID!, $userID: ID!) {
        activateDeviceUser(deviceID: $deviceID, userID: $userID) {
          device {
            deviceID
            deviceName
          }
          user {
            userID
            userName
          }
          status
        }
      }`;

    try {
      const result = <GraphQLResult<{ activateDeviceUser: DeviceUser }>>
        await API.graphql(
          graphqlOperation(activateDeviceUser, { deviceID, userID })
        );
      if (result.data) {
        const deviceUser = <DeviceUser>result.data.activateDeviceUser!;
        this.logger.debug('Device access request activated:', deviceUser);
        return deviceUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_ACTIVATE_DEVICE_USER, 'activateDeviceUser')
      }

    } catch (error) {
      this.logger.error('activateDeviceUser API call returned error: ', error);
      throw new Error(ERROR_ACTIVATE_DEVICE_USER, error);
    }
  }

  async deleteDeviceUser(deviceID: string, userID: string) {

    const deleteDeviceUser = /* GraphQL */ `
      mutation DeleteDeviceUser($deviceID: ID!, $userID: ID!) {
        deleteDeviceUser(deviceID: $deviceID, userID: $userID) {
          device {
            deviceID
            deviceName
          }
          user {
            userID
            userName
          }
          status
        }
      }`;

    try {
      const result = <GraphQLResult<{ deleteDeviceUser: DeviceUser }>>
        await API.graphql(
          graphqlOperation(deleteDeviceUser, { deviceID, userID })
        );
      if (result.data) {
        const deviceUser = <DeviceUser>result.data.deleteDeviceUser!;
        this.logger.debug('Device access deleted:', deviceUser);
        return deviceUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_DELETE_DEVICE_USER, 'deleteDeviceUser')
      }

    } catch (error) {
      this.logger.error('deleteDeviceUser API call returned error: ', error);
      throw new Error(ERROR_DELETE_DEVICE_USER, error);
    }
  }

  async deleteDevice(deviceID: string) {

    const deleteDevice = /* GraphQL */ `
      mutation DeleteDevice($deviceID: ID!) {
        deleteDevice(deviceID: $deviceID)
      }`;

    try {
      const result = <GraphQLResult<{ deleteDevice: string[] }>>
        await API.graphql(
          graphqlOperation(deleteDevice, { deviceID })
        );
      if (result.data) {
        this.logger.debug('Device deleted:', result.data);
      } else {
        throw this.handleErrorResponse(result, ERROR_DELETE_DEVICE_USER, 'deleteDevice')
      }

    } catch (error) {
      this.logger.error('deleteDevice API call returned error: ', error);
      throw new Error(ERROR_DELETE_DEVICE_USER, error);
    }
  }

  async getUserSpaces() {

    const getUser = /* GraphQL */ `
      query GetUser {
        getUser {
          spaces {
            totalCount
            spaceUsers {
              isOwner
              status
              space {
                spaceID
                spaceName
                recipe
                iaas
                region
                lastSeen
              }
            }
          }
        }
      }`;

    try {
      const result = <GraphQLResult<{ getUser: User }>>
        await API.graphql(
          graphqlOperation(getUser)
        );
      if (result.data) {
        const spaceUsers = <SpaceUser[]>result.data.getUser.spaces!.spaceUsers!;
        this.logger.debug('Retrieved user\'s spaces:', spaceUsers);
        return spaceUsers;
      } else {
        throw this.handleErrorResponse(result, ERROR_GET_USER_SPACES, 'getUserSpaces')
      }

    } catch (error) {
      this.logger.error('getUserSpaces API call returned error: ', error);
      throw new Error(ERROR_GET_USER_SPACES, error);
    }
  }

  async inviteSpaceUser(spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean) {

    const inviteSpaceUser = /* GraphQL */ `
      mutation InviteSpaceUser(
        $spaceID: ID!
        $userID: ID!
        $isAdmin: Boolean!
        $isEgressNode: Boolean!
      ) {
        inviteSpaceUser(
          spaceID: $spaceID
          userID: $userID
          isAdmin: $isAdmin
          isEgressNode: $isEgressNode
        ) {
          space {
            spaceID
            spaceName
          }
          user {
            userID
            userName
          }
          isOwner
          isAdmin
          isEgressNode
          status
        }
      }`;

    try {
      const result = <GraphQLResult<{ inviteSpaceUser: SpaceUser }>>
        await API.graphql(
          graphqlOperation(inviteSpaceUser, {
            spaceID,
            userID,
            isAdmin,
            isEgressNode
          })
        );
      if (result.data) {
        const spaceUser = <SpaceUser>result.data.inviteSpaceUser!;
        this.logger.debug('Invited user to space:', spaceUser);
        return spaceUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_INVITE_SPACE_USER, 'inviteSpaceUser')
      }

    } catch (error) {
      this.logger.error('inviteSpaceUser API call returned error: ', error);
      throw new Error(ERROR_INVITE_SPACE_USER, error);
    }
  }

  async deactivateSpaceUser(spaceID: string, userID: string) {

    const deactivateSpaceUser = /* GraphQL */ `
      mutation DeactivateSpaceUser($spaceID: ID!, $userID: ID!) {
        deactivateSpaceUser(spaceID: $spaceID, userID: $userID)  {
          space {
            spaceID
            spaceName
          }
          user {
            userID
            userName
          }
        }
      }`;

    try {
      const result = <GraphQLResult<{ deactivateSpaceUser: SpaceUser }>>
        await API.graphql(
          graphqlOperation(deactivateSpaceUser, { spaceID, userID })
        );
      if (result.data) {
        const spaceUser = <SpaceUser>result.data.deactivateSpaceUser;
        this.logger.debug('Deactivated user access to space:', spaceUser);
        return spaceUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_DEACTIVATE_SPACE_USER, 'deactivateSpaceUser')
      }

    } catch (error) {
      this.logger.error('deactivateSpaceUser API call returned error: ', error);
      throw new Error(ERROR_DEACTIVATE_SPACE_USER, error);
    }
  }

  async deleteSpaceUser(spaceID: string, userID: string) {

    const deleteSpaceUser = /* GraphQL */ `
      mutation DeleteSpaceUser($spaceID: ID!, $userID: ID!) {
        deleteSpaceUser(spaceID: $spaceID, userID: $userID) {
          space {
            spaceID
            spaceName
          }
          user {
            userID
            userName
          }
        }
      }`;

    try {
      const result = <GraphQLResult<{ deleteSpaceUser: SpaceUser }>>
        await API.graphql(
          graphqlOperation(deleteSpaceUser, { spaceID, userID })
        );
      if (result.data) {
        const spaceUser = <SpaceUser>result.data.deleteSpaceUser;
        this.logger.debug('Deleted user access to space:', spaceUser);
        return spaceUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_DELETE_SPACE_USER, 'deleteSpaceUser')
      }

    } catch (error) {
      this.logger.error('deleteSpaceUser API call returned error: ', error);
      throw new Error(ERROR_DELETE_SPACE_USER, error);
    }
  }

  async deleteSpace(spaceID: string) {

    const deleteSpace = /* GraphQL */ `
      mutation DeleteSpace($spaceID: ID!) {
        deleteSpace(spaceID: $spaceID)
      }`;

      try {
        const result = <GraphQLResult<{ deleteSpace: string[] }>>
          await API.graphql(
            graphqlOperation(deleteSpace, { spaceID })
          );
        if (result.data) {
          this.logger.debug('Space deleted:', result.data);
        } else {
          throw this.handleErrorResponse(result, ERROR_DELETE_SPACE, 'deleteSpace')
        }

      } catch (error) {
        this.logger.error('deleteSpace API call returned error: ', error);
        throw new Error(ERROR_DELETE_SPACE, error);
      }
  }

  async getSpaceInvitations() {

    const getSpaceInvitations = /* GraphQL */ `
      query GetSpaceInvitations {
        getSpaceInvitations {
          space {
            spaceID
            spaceName
            recipe
            iaas
            region
          }
          isAdmin
          isEgressNode
        }
      }`;

    try {
      const result = <GraphQLResult<{ getSpaceInvitations: SpaceUser[] }>>
        await API.graphql(
          graphqlOperation(getSpaceInvitations)
        );
      if (result.data) {
        const spaceUsers = <SpaceUser[]>result.data.getSpaceInvitations;
        this.logger.debug('Retrieved user\'s space invitations:', spaceUsers);
        return spaceUsers;
      } else {
        throw this.handleErrorResponse(result, ERROR_GET_SPACE_INVITATIONS, 'getSpaceInvitations')
      }

    } catch (error) {
      this.logger.error('getSpaceInvitations API call returned error: ', error);
      throw new Error(ERROR_GET_SPACE_INVITATIONS, error);
    }
  }

  async acceptSpaceUserInvitation(spaceID: string) {

    const acceptSpaceUserInvitation = /* GraphQL */ `
      mutation AcceptSpaceUserInvitation($spaceID: ID!) {
        acceptSpaceUserInvitation(spaceID: $spaceID) {
          space {
            spaceID
            spaceName
          }
          user {
            userID
            userName
          }
        }
      }
    `;

    try {
      const result = <GraphQLResult<{ acceptSpaceUserInvitation: SpaceUser }>>
        await API.graphql(
          graphqlOperation(acceptSpaceUserInvitation, { spaceID })
        );
      if (result.data) {
        const spaceUser = <SpaceUser>result.data.acceptSpaceUserInvitation;
        this.logger.debug('Accepted space invitation:', spaceUser);
        return spaceUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_ACCEPT_SPACE_USER_INVITATION, 'acceptSpaceUserInvitation')
      }

    } catch (error) {
      this.logger.error('acceptSpaceUserInvitation API call returned error: ', error);
      throw new Error(ERROR_ACCEPT_SPACE_USER_INVITATION, error);
    }
  }

  async leaveSpaceUser(spaceID: string) {

    const leaveSpaceUser = /* GraphQL */ `
      mutation LeaveSpaceUser($spaceID: ID!) {
        leaveSpaceUser(spaceID: $spaceID) {
          space {
            spaceID
            spaceName
          }
          user {
            userID
            userName
          }
        }
      }
    `;

    try {
      const result = <GraphQLResult<{ leaveSpaceUser: SpaceUser }>>
        await API.graphql(
          graphqlOperation(leaveSpaceUser, { spaceID })
        );
      if (result.data) {
        const spaceUser = <SpaceUser>result.data.leaveSpaceUser;
        this.logger.debug('User left space:', spaceUser);
        return spaceUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_LEAVE_SPACE_USER, 'leaveSpaceUser')
      }

    } catch (error) {
      this.logger.error('leaveSpaceUser API call returned error: ', error);
      throw new Error(ERROR_LEAVE_SPACE_USER, error);
    }
  }

  async getUserApps() {
    return [];
  }

  async getAppInvitations() {
    return [];
  }

  private handleErrorResponse(result: GraphQLResult, errorType: string, apiName: string): Error {
    if (result.errors) {
      this.logger.error(`${apiName} API response return error: `, result.errors);
      return new Error(errorType, 'error returned from API');
    } else {
      this.logger.debug(`${apiName} API returned no data: `, result);
      return new Error(errorType, 'no data');
    }
  }
}
