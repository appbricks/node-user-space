import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import Observable, { ZenObservable } from 'zen-observable-ts';

import {
  Logger,
  Error
} from '@appbricks/utils';

import ProviderInterface from '../../provider';

import {
  UserRef,
  User,
  Device,
  DeviceUser,
  Space,
  SpaceUser,
  App,
  AppUser,
  UserUpdate,
  DeviceUpdate,
  DeviceUserUpdate,
  SpaceUpdate,
  SpaceUserUpdate,
  AppUpdate,
  AppUserUpdate,
  Key
} from '../../../model/types';

import {
  ERROR_USER_SEARCH,
  ERROR_GET_USER_DEVICES,
  ERROR_GET_DEVICE_ACCESS_REQUESTS,
  ERROR_ACTIVATE_DEVICE_USER,
  ERROR_DELETE_DEVICE_USER,
  ERROR_DELETE_DEVICE,
  ERROR_UPDATE_DEVICE,
  ERROR_GET_USER_SPACES,
  ERROR_INVITE_SPACE_USER,
  ERROR_ACTIVATE_SPACE_USER,
  ERROR_DEACTIVATE_SPACE_USER,
  ERROR_DELETE_SPACE_USER,
  ERROR_DELETE_SPACE,
  ERROR_GET_SPACE_INVITATIONS,
  ERROR_ACCEPT_SPACE_USER_INVITATION,
  ERROR_LEAVE_SPACE_USER,
  ERROR_UPDATE_SPACE,
  ERROR_UPDATE_SPACE_USER,
  ERROR_GET_USER_APPS,
  ERROR_ADD_APP_USER,
  ERROR_DELETE_APP_USER,
  ERROR_DELETE_APP
} from '../../constants';

/**
 * AWS AppSync User-Space API provider.
 */
export default class Provider implements ProviderInterface {

  private logger: Logger;

  private api: typeof API;

  private subscriptions: {[id: string]: ZenObservable.Subscription} = {};

  constructor(api?: typeof API) {
    this.logger = new Logger('AwsUserSpaceProvider');
    this.api = api || API;

    // update active subscription timestamps every 30s
    setInterval(this.touchSubscriptions.bind(this), 30000)
  }

  async touchSubscriptions() {

    if (this.subscriptions) {
      let subs = Object.keys(this.subscriptions);
      this.logger.debug('Updating timestamps of subscriptions:', subs)

      if (subs.length) {
        const touchSubscriptions = /* GraphQL */ `
        mutation TouchSubscriptions($subs: [String!]) {
          touchSubscriptions(subs: $subs)
        }`;
  
        try {
          const result = <GraphQLResult<{ touchSubscriptions: string }>>
            await this.api.graphql(
              graphqlOperation(touchSubscriptions, { subs })
            );
          if (result.data) {
            this.logger.debug('Updated timestamps of subscriptions to ', result.data);
          } else {
            this.logger.error('Failed updating timestamps of subscriptions:', result)
          }
  
        } catch (error) {
          this.logger.error('touchSubscriptions API call returned error: ', error);
        }
      }
    }
  }

  async userSearch(namePrefix: string, limit?: number) {

    this.logger.debug('User search query - namePrefix, limit, cursor:', namePrefix, limit);

    const userSearchQuery = /* GraphQL */ `
      query UserSearch(
        $namePrefix: String!
        $limit: Int
      ) {
        userSearch(filter: {userName: $namePrefix}, limit: $limit) {
          userID
          userName
          firstName
          middleName
          familyName
        }
      }`;

    try {
      const result = <GraphQLResult<{ userSearch: UserRef[] }>>
        await this.api.graphql(
          graphqlOperation(userSearchQuery, { namePrefix, limit })
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

  async subscribeToUserUpdates(
    userID: string,
    update: (data: UserUpdate) => void,
    error: (error: any) => void
  ) {
    const subscriptionKey = `{"name":"userUpdates","keys":{"userID":"${userID}"}}`;
    await this.unsubscribe(subscriptionKey);

    const subscriptionQuery = /* GraphQL */ `
      subscription SubscribeToUserUpdates($userID: ID!) {
        userUpdates(userID: $userID) {
          userID
          numDevices
          numSpaces
          user {
            userID
            userName
            firstName
            middleName
            familyName
            emailAddress
            mobilePhone
            confirmed
            publicKey
            certificate
          }
        }
      }`;

    const observable: Observable<object> = <Observable<object>>API.graphql(
      graphqlOperation(subscriptionQuery, { userID })
    );
    const subscription = observable.subscribe({
      next: data => update(<UserUpdate>(<any>data).value.data.userUpdates),
      error: data => error(data.error)
    });
    this.logger.debug('Creating subscription:', subscriptionKey);
    this.subscriptions[subscriptionKey] = subscription;
  }

  async unsubscribeFromUserUpdates(
    userID: string,
  ) {
    await this.unsubscribe(`{"name":"userUpdates","keys":{"userID":"${userID}"}}`);
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
              bytesUploaded
              bytesDownloaded
              lastAccessTime
              lastConnectSpace {
                spaceID
                spaceName
              }
              user {
                userID
              }
              device {
                deviceID
                deviceName
                owner {
                  userID
                  userName
                  firstName
                  middleName
                  familyName
                }
                deviceType
                clientVersion
                publicKey
                certificate
                settings
                users {
                  totalCount
                  deviceUsers {
                    user {
                      userID
                      userName
                      firstName
                      middleName
                      familyName
                    }
                    isOwner
                    status
                    bytesUploaded
                    bytesDownloaded
                    lastAccessTime
                    lastConnectSpace {
                      spaceID
                      spaceName
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
        await this.api.graphql(
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

  async subscribeToDeviceUpdates(
    deviceID: string,
    update: (data: DeviceUpdate) => void,
    error: (error: any) => void
  ) {
    const subscriptionKey = `{"name":"deviceUpdates","keys":{"deviceID":"${deviceID}"}}`;
    await this.unsubscribe(subscriptionKey);

    const subscriptionQuery = /* GraphQL */ `
      subscription SubscribeToDeviceUpdates($deviceID: ID!) {
        deviceUpdates(deviceID: $deviceID) {
          deviceID
          numUsers
          device {
            deviceID
            deviceName
            publicKey
            certificate
          }
        }
      }`;

    const observable: Observable<object> = <Observable<object>>API.graphql(
      graphqlOperation(subscriptionQuery, { deviceID })
    );
    const subscription = observable.subscribe({
      next: data => update(<DeviceUpdate>(<any>data).value.data.deviceUpdates),
      error: data => error(data.error)
    });
    this.logger.debug('Creating subscription:', subscriptionKey);
    this.subscriptions[subscriptionKey] = subscription;
  }

  async unsubscribeFromDeviceUpdates(
    deviceID: string,
  ) {
    await this.unsubscribe(`{"name":"deviceUpdates","keys":{"deviceID":"${deviceID}"}}`);
  }

  async subscribeToDeviceUserUpdates(
    deviceID: string,
    userID: string,
    update: (data: DeviceUserUpdate) => void,
    error: (error: any) => void
  ) {
    const subscriptionKey = `{"name":"deviceUserUpdates","keys":{"deviceID":"${deviceID}","userID":"${userID}"}}`;
    await this.unsubscribe(subscriptionKey);

    const subscriptionQuery = /* GraphQL */ `
      subscription SubscribeToDeviceUserUpdates($deviceID: ID!, $userID: ID!) {
        deviceUserUpdates(deviceID: $deviceID, userID: $userID) {
          deviceID
          userID
          deviceUser {
            device {
              deviceID
            }
            user {
              userID
            }
            status
            bytesUploaded
            bytesDownloaded
            lastAccessTime
            lastConnectSpace {
              spaceID
              spaceName
            }
          }
        }
      }`;

    const observable: Observable<object> = <Observable<object>>API.graphql(
      graphqlOperation(subscriptionQuery, { deviceID, userID })
    );
    const subscription = observable.subscribe({
      next: data => update(<DeviceUserUpdate>(<any>data).value.data.deviceUserUpdates),
      error: data => error(data.error)
    });
    this.logger.debug('Creating subscription:', subscriptionKey);
    this.subscriptions[subscriptionKey] = subscription;
  }

  async unsubscribeFromDeviceUserUpdates(
    deviceID: string,
    userID: string,
  ) {
    await this.unsubscribe(`{"name":"deviceUserUpdates","keys":{"deviceID":"${deviceID}","userID":"${userID}"}}`);
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
        await this.api.graphql(
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
        await this.api.graphql(
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

  async deleteDeviceUser(deviceID: string, userID?: string) {

    const deleteDeviceUser = /* GraphQL */ `
      mutation DeleteDeviceUser($deviceID: ID!, $userID: ID) {
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
        await this.api.graphql(
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
        await this.api.graphql(
          graphqlOperation(deleteDevice, { deviceID })
        );
      if (result.data) {
        this.logger.debug('Device deleted:', result.data);
      } else {
        throw this.handleErrorResponse(result, ERROR_DELETE_DEVICE, 'deleteDevice')
      }

    } catch (error) {
      this.logger.error('deleteDevice API call returned error: ', error);
      throw new Error(ERROR_DELETE_DEVICE, error);
    }
  }

  async updateDevice(deviceID: string, deviceKey?: Key, clientVersion?: string, settings?: string) {

    const updateDevice = /* GraphQL */ `
      mutation updateDevice($deviceID: ID!, $deviceKey: Key, $clientVersion: String, $settings: String) {
        updateDevice(deviceID: $deviceID, deviceKey: $deviceKey, clientVersion: $clientVersion, settings: $settings) {
          deviceID
          deviceName
          deviceType
          clientVersion
          publicKey
          certificate
          settings
        }
      }
    `;

    try {
      const result = <GraphQLResult<{ updateDevice: Device }>>
        await this.api.graphql(
          graphqlOperation(updateDevice, { deviceID, deviceKey, clientVersion, settings })
        );
      if (result.data) {
        const device = <Device>result.data.updateDevice;
        this.logger.debug('Updated device:', device);
        return device;
      } else {
        throw this.handleErrorResponse(result, ERROR_UPDATE_DEVICE, 'updateDevice')
      }

    } catch (error) {
      this.logger.error('updateDevice API call returned error: ', error);
      throw new Error(ERROR_UPDATE_DEVICE, error);
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
              isAdmin
              isEgressNode
              status
              bytesUploaded
              bytesDownloaded
              lastConnectTime
              lastConnectDevice {
                deviceID
                deviceName
              }
              user {
                userID
              }
              space {
                spaceID
                spaceName
                owner {
                  userID
                  userName
                  firstName
                  middleName
                  familyName
                }
                admins {
                  userID
                  userName
                  firstName
                  middleName
                  familyName
                }
                recipe
                iaas
                region
                version
                publicKey
                certificate
                isEgressNode
                settings
                ipAddress
                fqdn
                port
                vpnType
                localCARoot
                status
                lastSeen
                users {
                  spaceUsers {
                    user {
                      userID
                      userName
                      firstName
                      middleName
                      familyName
                    }
                    isOwner
                    isAdmin
                    isEgressNode
                    status
                    bytesUploaded
                    bytesDownloaded
                    lastConnectTime
                    lastConnectDevice {
                      deviceID
                      deviceName
                    }
                  }
                }
                apps {
                  spaceApps {
                    appID
                    appName
                  }
                }
              }
            }
          }
        }
      }`;

    try {
      const result = <GraphQLResult<{ getUser: User }>>
        await this.api.graphql(
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

  async subscribeToSpaceUpdates(
    spaceID: string,
    update: (data: SpaceUpdate) => void,
    error: (error: any) => void
  ) {
    const subscriptionKey = `{"name":"spaceUpdates","keys":{"spaceID":"${spaceID}"}}`;
    await this.unsubscribe(subscriptionKey);

    const subscriptionQuery = /* GraphQL */ `
      subscription SubscribeToSpaceUpdates($spaceID: ID!) {
        spaceUpdates(spaceID: $spaceID) {
          spaceID
          numUsers
          space {
            spaceID
            spaceName
            recipe
            iaas
            region
            version
            publicKey
            certificate
            isEgressNode
            settings
            status
            lastSeen
          }
        }
      }`;

    const observable: Observable<object> = <Observable<object>>API.graphql(
      graphqlOperation(subscriptionQuery, { spaceID })
    );
    const subscription = observable.subscribe({
      next: data => update(<SpaceUpdate>(<any>data).value.data.spaceUpdates),
      error: data => error(data.error)
    });
    this.logger.debug('Creating subscription:', subscriptionKey);
    this.subscriptions[subscriptionKey] = subscription;
  }

  async unsubscribeFromSpaceUpdates(
    spaceID: string,
  ) {
    await this.unsubscribe(`{"name":"spaceUpdates","keys":{"spaceID":"${spaceID}"}}`);
  }

  async subscribeToSpaceUserUpdates(
    spaceID: string,
    userID: string,
    update: (data: SpaceUserUpdate) => void,
    error: (error: any) => void
  ) {
    const subscriptionKey = `{"name":"spaceUserUpdates","keys":{"spaceID":"${spaceID}","userID":"${userID}"}}`;
    await this.unsubscribe(subscriptionKey);

    const subscriptionQuery = /* GraphQL */ `
      subscription SubscribeToSpaceUserUpdates($spaceID: ID!, $userID: ID!) {
        spaceUserUpdates(spaceID: $spaceID, userID: $userID) {
          spaceID
          userID
          spaceUser {
            space {
              spaceID
            }
            user {
              userID
            }
            isEgressNode
            status
            bytesUploaded
            bytesDownloaded
            lastConnectTime
            lastConnectDevice {
              deviceID
              deviceName
            }
          }
        }
      }`;

    const observable: Observable<object> = <Observable<object>>API.graphql(
      graphqlOperation(subscriptionQuery, { spaceID, userID })
    );
    const subscription = observable.subscribe({
      next: data => update(<SpaceUserUpdate>(<any>data).value.data.spaceUserUpdates),
      error: data => error(data.error)
    });
    this.logger.debug('Creating subscription:', subscriptionKey);
    this.subscriptions[subscriptionKey] = subscription;
  }

  async unsubscribeFromSpaceUserUpdates(
    spaceID: string,
    userID: string,
  ) {
    await this.unsubscribe(`{"name":"spaceUserUpdates","keys":{"spaceID":"${spaceID}","userID":"${userID}"}}`);
  }

  async inviteSpaceUser(spaceID: string, userID: string, isEgressNode: boolean) {

    const inviteSpaceUser = /* GraphQL */ `
      mutation InviteSpaceUser(
        $spaceID: ID!
        $userID: ID!
        $isEgressNode: Boolean!
      ) {
        inviteSpaceUser(
          spaceID: $spaceID
          userID: $userID
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
        await this.api.graphql(
          graphqlOperation(inviteSpaceUser, {
            spaceID,
            userID,
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

  async activateSpaceUser(spaceID: string, userID: string) {

    const activateSpaceUser = /* GraphQL */ `
      mutation ActivateSpaceUser($spaceID: ID!, $userID: ID!) {
        activateSpaceUser(spaceID: $spaceID, userID: $userID)  {
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
      const result = <GraphQLResult<{ activateSpaceUser: SpaceUser }>>
        await this.api.graphql(
          graphqlOperation(activateSpaceUser, { spaceID, userID })
        );
      if (result.data) {
        const spaceUser = <SpaceUser>result.data.activateSpaceUser;
        this.logger.debug('Activated user access to space:', spaceUser);
        return spaceUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_ACTIVATE_SPACE_USER, 'activateSpaceUser')
      }

    } catch (error) {
      this.logger.error('activateSpaceUser API call returned error: ', error);
      throw new Error(ERROR_ACTIVATE_SPACE_USER, error);
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
        await this.api.graphql(
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

  async deleteSpaceUser(spaceID: string, userID?: string) {

    const deleteSpaceUser = /* GraphQL */ `
      mutation DeleteSpaceUser($spaceID: ID!, $userID: ID) {
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
        await this.api.graphql(
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
          await this.api.graphql(
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

  async updateSpace(spaceID: string, spaceKey?: Key, version?: string, settings?: string) {

    const updateSpace = /* GraphQL */ `
      mutation updateSpace($spaceID: ID!, $spaceKey: Key, $version: String, $settings: String) {
        updateSpace(spaceID: $spaceID, spaceKey: $spaceKey, version: $version, settings: $settings) {
          spaceID
          spaceName
          recipe
          iaas
          region
          version
          publicKey
          certificate
          isEgressNode
          settings
          status
          lastSeen
        }
      }
    `;

    try {
      const result = <GraphQLResult<{ updateSpace: Space }>>
        await this.api.graphql(
          graphqlOperation(updateSpace, { spaceID, spaceKey, version, settings })
        );
      if (result.data) {
        const space = <Space>result.data.updateSpace;
        this.logger.debug('Updated space:', space);
        return space;
      } else {
        throw this.handleErrorResponse(result, ERROR_UPDATE_SPACE, 'updateSpace')
      }

    } catch (error) {
      this.logger.error('updateSpace API call returned error: ', error);
      throw new Error(ERROR_UPDATE_SPACE, error);
    }
  }

  async updateSpaceUser(spaceID: string, userID: string, isEgressNode: boolean) {

    const updateSpaceUser = /* GraphQL */ `
      mutation updateSpaceUser($spaceID: ID!, $userID: ID, $isEgressNode: Boolean) {
        updateSpaceUser(spaceID: $spaceID, userID: $userID, isEgressNode: $isEgressNode) {
          isOwner
          isAdmin
          isEgressNode
          status
        }
      }
    `;

    try {
      const result = <GraphQLResult<{ updateSpaceUser: SpaceUser }>>
        await this.api.graphql(
          graphqlOperation(updateSpaceUser, { spaceID, userID, isEgressNode })
        );
      if (result.data) {
        const spaceUser = <SpaceUser>result.data.updateSpaceUser;
        this.logger.debug('Updated space user:', spaceUser);
        return spaceUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_UPDATE_SPACE_USER, 'updateSpaceUser')
      }

    } catch (error) {
      this.logger.error('updateSpaceUser API call returned error: ', error);
      throw new Error(ERROR_UPDATE_SPACE_USER, error);
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
            version
          }
          isEgressNode
        }
      }`;

    try {
      const result = <GraphQLResult<{ getSpaceInvitations: SpaceUser[] }>>
        await this.api.graphql(
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
        await this.api.graphql(
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
        await this.api.graphql(
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

    const getUser = /* GraphQL */ `
      query GetUser {
        getUser {
          apps {
            totalCount
            appUsers {
              isOwner
              lastAccessedTime
              user {
                userID
              }
              app {
                appID
                appName
                recipe
                iaas
                region
                version
                status
                space {
                  spaceID
                  spaceName
                  owner {
                    userID
                    userName
                    firstName
                    middleName
                    familyName
                  }
                }
                users {
                  appUsers {
                    user {
                      userID
                      userName
                      firstName
                      middleName
                      familyName
                    }
                    isOwner
                    lastAccessedTime
                  }
                }
              }
            }
          }
        }
      }`;

    try {
      const result = <GraphQLResult<{ getUser: User }>>
        await this.api.graphql(
          graphqlOperation(getUser)
        );
      if (result.data) {
        const appUsers = <AppUser[]>result.data.getUser.apps!.appUsers!;
        this.logger.debug('Retrieved user\'s apps:', appUsers);
        return appUsers;
      } else {
        throw this.handleErrorResponse(result, ERROR_GET_USER_APPS, 'getUserApps')
      }

    } catch (error) {
      this.logger.error('getUserApps API call returned error: ', error);
      throw new Error(ERROR_GET_USER_APPS, error);
    }
  }

  async subscribeToAppUpdates(
    appID: string, 
    update: (data: AppUpdate) => void, 
    error: (error: any) => void
  ) {
    const subscriptionKey = `{"name":"appUpdates","keys":{"appID":"${appID}"}}`;
    await this.unsubscribe(subscriptionKey);

    const subscriptionQuery = /* GraphQL */ `
      subscription SubscribeToAppUpdates($appID: ID!) {
        appUpdates(appID: $appID) {
          appID
          numUsers
          app {
            appID
            appName
            recipe
            iaas
            region
            version
            status
          }
        }
      }`;

    const observable: Observable<object> = <Observable<object>>API.graphql(
      graphqlOperation(subscriptionQuery, { appID })
    );
    const subscription = observable.subscribe({
      next: data => update(<AppUpdate>(<any>data).value.data.appUpdates),
      error: data => error(data.error)
    });
    this.logger.debug('Creating subscription:', subscriptionKey);
    this.subscriptions[subscriptionKey] = subscription;
  }

  async unsubscribeFromAppUpdates(
    appID: string
  ) {
    await this.unsubscribe(`{"name":"appUpdates","keys":{"appID":"${appID}"}}`);
  }

  async subscribeToAppUserUpdates(
    appID: string, 
    userID: string,
    update: (data: AppUserUpdate) => void, 
    error: (error: any) => void
  ) {
    const subscriptionKey = `{"name":"appUserUpdates","keys":{"appID":"${appID}","userID":"${userID}"}}`;
    await this.unsubscribe(subscriptionKey);

    const subscriptionQuery = /* GraphQL */ `
      subscription SubscribeToAppUserUpdates($appID: ID!, $userID: ID!) {
        appUserUpdates(appID: $appID, userID: $userID) {
          appID
          userID
          appUser {
            app {
              appID
            }
            user {
              userID
            }
            lastAccessedTime
          }
        }
      }`;

    const observable: Observable<object> = <Observable<object>>API.graphql(
      graphqlOperation(subscriptionQuery, { appID, userID })
    );
    const subscription = observable.subscribe({
      next: data => update(<AppUserUpdate>(<any>data).value.data.appUserUpdates),
      error: data => error(data.error)
    });
    this.logger.debug('Creating subscription:', subscriptionKey);
    this.subscriptions[subscriptionKey] = subscription;
  }

  async unsubscribeFromAppUserUpdates(
    appID: string,
    userID: string,
  ) {
    await this.unsubscribe(`{"name":"appUserUpdates","keys":{"appID":"${appID}","userID":"${userID}"}}`);
  }

  async addAppUser(appID: string, userID: string) {

    const addAppUser = /* GraphQL */ `
      mutation AddAppUser(
        $appID: ID!
        $userID: ID!
      ) {
        addAppUser(
          appID: $appID
          userID: $userID
        ) {
          app {
            appID
            appName
          }
          user {
            userID
            userName
          }
          isOwner
          lastAccessedTime
        }
      }`;

    try {
      const result = <GraphQLResult<{ addAppUser: AppUser }>>
        await this.api.graphql(
          graphqlOperation(addAppUser, {
            appID,
            userID,
          })
        );
      if (result.data) {
        const appUser = <AppUser>result.data.addAppUser!;
        this.logger.debug('Add user to app:', appUser);
        return appUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_ADD_APP_USER, 'addAppUser')
      }

    } catch (error) {
      this.logger.error('addAppUser API call returned error: ', error);
      throw new Error(ERROR_ADD_APP_USER, error);
    }
  }

  async deleteAppUser(appID: string, userID?: string) {

    const deleteAppUser = /* GraphQL */ `
      mutation DeleteAppUser(
        $appID: ID!
        $userID: ID
      ) {
        deleteAppUser(
          appID: $appID
          userID: $userID
        ) {
          app {
            appID
            appName
          }
          user {
            userID
            userName
          }
          isOwner
          lastAccessedTime
        }
      }`;

    try {
      const result = <GraphQLResult<{ deleteAppUser: AppUser }>>
        await this.api.graphql(
          graphqlOperation(deleteAppUser, {
            appID,
            userID,
          })
        );
      if (result.data) {
        const appUser = <AppUser>result.data.deleteAppUser!;
        this.logger.debug('Delete user from app:', appUser);
        return appUser;
      } else {
        throw this.handleErrorResponse(result, ERROR_DELETE_APP_USER, 'deleteAppUser')
      }

    } catch (error) {
      this.logger.error('deleteAppUser API call returned error: ', error);
      throw new Error(ERROR_DELETE_APP_USER, error);
    }
  }

  async deleteApp(appID: string) {

    const deleteApp = /* GraphQL */ `
      mutation DeleteApp($appID: ID!) {
        deleteApp(appID: $appID)
      }`;

    try {
      const result = <GraphQLResult<{ deleteApp: AppUser }>>
        await this.api.graphql(
          graphqlOperation(deleteApp, { appID })
        );
      if (result.data) {
        this.logger.debug('App deleted:', result.data);
      } else {
        throw this.handleErrorResponse(result, ERROR_DELETE_APP, 'deleteApp')
      }

    } catch (error) {
      this.logger.error('deleteApp API call returned error: ', error);
      throw new Error(ERROR_DELETE_APP, error);
    }
  }

  async unsubscribeAll() {
    for (const subscriptionKey in this.subscriptions) {
      await this.unsubscribe(subscriptionKey);
    }
    return
  }

  private async unsubscribe(
    subscriptionKey: string,
  ) {
    const subscription = this.subscriptions[subscriptionKey];
    if (subscription) {
      this.logger.debug('Deleting subscription:', subscriptionKey);
      delete this.subscriptions[subscriptionKey];
      await subscription.unsubscribe();
    }
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
