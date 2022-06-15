import { 
  UserRef,
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
} from '../model/types';

/**
 * MBaaS User Space Provider interface
 *
 * The implementor of this interface would contain
 * the cloud service provider specific logic. The
 * provider should also implement and maintain
 * the underlying authorization context which is 
 * not available via this interface.
 */

export default interface Provider {

  /**
   * Looks up users with names that start
   * with the given prefix.
   */
  userSearch(namePrefix: string, limit?: number): Promise<UserRef[]>;

  /**
   * Subscribes the user update stream.
   */
  subscribeToUserUpdates(userID: string, update: (data: UserUpdate) => void, error: (error: any) => void): Promise<void>;

  /**
   * Unsubscribes from the user update stream.
   */
  unsubscribeFromUserUpdates(userID: string): Promise<void>;

  /**
   * Returns list of devices the current
   * logged in user has access to.
   */
  getUserDevices(): Promise<DeviceUser[]>;

  /**
   * Subscribes to the device update stream.
   */
  subscribeToDeviceUpdates(deviceID: string, update: (data: DeviceUpdate) => void, error: (error: any) => void): Promise<void>;

  /**
   * Unsubscribes from the device update stream.
   */
  unsubscribeFromDeviceUpdates(deviceID: string): Promise<void>;

  /**
   * Subscribes to the device user update stream.
   */
  subscribeToDeviceUserUpdates(deviceID: string, userID: string, update: (data: DeviceUserUpdate) => void, error: (error: any) => void): Promise<void>;

  /**
   * Unsubscribe from the device user update stream.
   */
  unsubscribeFromDeviceUserUpdates(deviceID: string, userID: string): Promise<void>;

  /**
   * Returns list of device access requests
   * logged in user has recieved for his/her
   * owned devices.
   */
  getDeviceAccessRequests(deviceID: string): Promise<DeviceUser[]>;

  /**
   * Activates the owned device for use by
   * the given user that requested access to
   * the it.
   */
  activateDeviceUser(deviceID: string, userID: string): Promise<DeviceUser>;

  /**
   * Deletes the given user from the device.
   */
  deleteDeviceUser(deviceID: string, userID: string): Promise<DeviceUser>;

  /**
   * Deletes the given device
   */
  deleteDevice(deviceID: string): Promise<void>;

  /**
   * Updates a device
   */
  updateDevice(deviceID: string, deviceKey: Key, clientVersion: string, settings: string): Promise<Device>;

  /**
   * Returns list of spaces the current
   * logged in user can connect to.
   */
  getUserSpaces(): Promise<SpaceUser[]>;

  /**
   * Subscribe to the space update stream.
   */
  subscribeToSpaceUpdates(spaceID: string, update: (data: SpaceUpdate) => void, error: (error: any) => void): Promise<void>;

  /**
   * Unsubscribe from the space update stream.
   */
  unsubscribeFromSpaceUpdates(spaceID: string): Promise<void>;

  /**
   * Subscribe to the space user update stream.
   */
  subscribeToSpaceUserUpdates(spaceID: string, userID: string, update: (data: SpaceUserUpdate) => void, error: (error: any) => void): Promise<void>;

  /**
   * Unubscribe from the space user update stream.
   */
  unsubscribeFromSpaceUserUpdates(spaceID: string, userID: string): Promise<void>

  /**
   * Returns list of space invitations the
   * logged in user has received.
   */
  getSpaceInvitations(): Promise<SpaceUser[]>;

  /**
   * Activate user's access to the given space.
   */
  activateSpaceUser(spaceID: string, userID: string): Promise<SpaceUser>;

  /**
   * Remove user's access to the given space.
   */
  deactivateSpaceUser(spaceID: string, userID: string): Promise<SpaceUser>;

  /**
   * Remove user's access to the given space.
   */
  deleteSpaceUser(spaceID: string, userID: string): Promise<SpaceUser>;

  /**
   * Deletes the give space and all user
   * associations.
   */
  deleteSpace(spaceID: string): Promise<void>;

  /**
   * Updates a space
   */
  updateSpace(spaceID: string, spaceKey: Key, version: string, settings: string): Promise<Space>;

   /**
    * Updates a space user
    */
  updateSpaceUser(spaceID: string, userID: string, isEgressNode: boolean): Promise<SpaceUser>;
 
  /**
   * Invite the a user to a space owned by
   * the logged in user
   */
  inviteSpaceUser(spaceID: string, userID: string, isEgressNode: boolean): Promise<SpaceUser>;

  /**
   * Accepts the invitation to the given
   * space.
   */
  acceptSpaceUserInvitation(spaceID: string): Promise<SpaceUser>;

  /**
   * Leaves given space
   */
  leaveSpaceUser(spaceID: string): Promise<SpaceUser>;

  /**
   * Returns list of apps the current
   * logged in user can connect and use.
   */
  getUserApps(): Promise<AppUser[]>;

  /**
   * Subscribe to the app update stream.
   */
  subscribeToAppUpdates(appID: string, update: (data: AppUpdate) => void, error: (error: any) => void): Promise<void>;

  /**
   * Unsubscribe from the app update stream.
   */
  unsubscribeFromAppUpdates(appID: string): Promise<void>;

  /**
   * Subscribe to the space user update stream.
   */
  subscribeToAppUserUpdates(appID: string, userID: string, update: (data: AppUserUpdate) => void, error: (error: any) => void): Promise<void>;

   /**
    * Unubscribe from the space user update stream.
    */
  unsubscribeFromAppUserUpdates(appID: string, userID: string): Promise<void>
 
  /**
   * Adds a user to an app owned by
   * the logged in user
   */
  addAppUser(appID: string, userID: string): Promise<AppUser>;

  /**
   * Deletes the given user from the app.
   */
  deleteAppUser(deviceID: string, userID: string): Promise<AppUser>;

  /**
   * Deletes the given app and all user
   * associations.
   */
  deleteApp(appID: string): Promise<void>;

  /**
   * Unsubscribe from all active subscriptions
   */
  unsubscribeAll(): Promise<void>;
}
