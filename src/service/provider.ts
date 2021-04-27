import { 
  UserSearchConnection,
  Device,
  DeviceUser,
  Space,
  SpaceUser,
  App,
  AppUser
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
  userSearch(namePrefix: string): UserSearchConnection;

  /**
   * Returns list of devices the current
   * logged in user has access to.
   */
  getUserDevices(): Device[];

  /**
   * Returns list of device access requests
   * logged in user has recieved for his/her
   * owned devices.
   */
  getDeviceAccessRequests(deviceID: string): DeviceUser[];

  /**
   * Activates the owned device for use by
   * the given user that requested access to
   * the it.
   */
  activateDeviceUser(deviceID: string, userID: string): DeviceUser;

  /**
   * Deletes the given user from the device.
   */
  deleteDeviceUser(deviceID: string, userID: string): DeviceUser;

  /**
   * Deletes the given device
   */
  deleteDevice(deviceID: string): Device;

  /**
   * Returns list of spaces the current
   * logged in user can connect to.
   */
  getUserSpaces(): Space[];

  /**
   * Returns list of space invitations the
   * logged in user has received.
   */
  getSpaceInvitations(): SpaceUser[];

  /**
   * Remove user's access to the given space.
   */
  deactivateSpaceUser(spaceID: string, userID: string): SpaceUser;

  /**
   * Remove user's access to the given space.
   */
  deleteSpaceUser(spaceID: string, userID: string): SpaceUser;

  /**
   * Deletes the give space and all user
   * associations.
   */
  deleteSpace(spaceID: string): Space;

  /**
   * Invite the a user to a space owned by
   * the logged in user
   */
  inviteSpaceUser(spaceID: string, userID: string, isAdmin: boolean, isEgressNode: boolean): SpaceUser;

  /**
   * Accepts the invitation to the given
   * space.
   */
  acceptSpaceUserInvitation(spaceID: string): SpaceUser;

  /**
   * Leaves given space
   */
  leaveSpaceUser(spaceID: string): SpaceUser;

  /**
   * Returns list of apps the current
   * logged in user can connect and use.
   */
  getUserApps(): App[];

  /**
   * Returns list of apps invitations the 
   * logged in user has received.
   */
  getAppInvitations(): AppUser[];
}
