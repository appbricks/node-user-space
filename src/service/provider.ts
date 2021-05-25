import { 
  UserSearchConnection,
  DeviceUser,
  SpaceUser,
  App,
  AppUser,
  CursorInput
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
  userSearch(namePrefix: string, limit?: number, cursor?: CursorInput): Promise<UserSearchConnection>;

  /**
   * Returns list of devices the current
   * logged in user has access to.
   */
  getUserDevices(): Promise<DeviceUser[]>;

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
   * Returns list of spaces the current
   * logged in user can connect to.
   */
  getUserSpaces(): Promise<SpaceUser[]>;

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
   * Invite the a user to a space owned by
   * the logged in user
   */
  inviteSpaceUser(spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean): Promise<SpaceUser>;

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
  getUserApps(): Promise<App[]>;

  /**
   * Returns list of apps invitations the 
   * logged in user has received.
   */
  getAppInvitations(): Promise<AppUser[]>;
}
