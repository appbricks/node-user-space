/**
 * Provider common constants
 */

export const ERROR_UPDATE_USER = 'updateUserAPIError';
export const ERROR_USER_SEARCH = 'userSearchAPIError';
export const ERROR_GET_USER_DEVICES = 'getUserDevicesAPIError';
export const ERROR_GET_DEVICE_ACCESS_REQUESTS = 'getDeviceAccessRequestsAPIError';
export const ERROR_ACTIVATE_DEVICE_USER = 'activateDeviceUserAPIError';
export const ERROR_DELETE_DEVICE_USER = 'deleteDeviceUserAPIError';
export const ERROR_DELETE_DEVICE = 'deleteDeviceAPIError';
export const ERROR_UPDATE_DEVICE = 'updateDeviceAPIError';
export const ERROR_SET_DEVICE_USER_SPACE_CONFIG = 'setDeviceUserSpaceConfigAPIError';
export const ERROR_GET_USER_SPACES = 'getUserSpacesAPIError';
export const ERROR_INVITE_SPACE_USER = 'inviteSpaceUserAPIError';
export const ERROR_ACTIVATE_SPACE_USER = 'activateSpaceUserAPIError';
export const ERROR_DEACTIVATE_SPACE_USER = 'deactivateSpaceUserAPIError';
export const ERROR_DELETE_SPACE_USER = 'deleteSpaceUserAPIError';
export const ERROR_DELETE_SPACE = 'deleteSpaceAPIError';
export const ERROR_GET_SPACE_INVITATIONS = 'getSpaceInvitationsAPIError';
export const ERROR_ACCEPT_SPACE_USER_INVITATION = 'acceptSpaceUserInvitationAPIError';
export const ERROR_LEAVE_SPACE_USER = 'leaveSpaceUserAPIError';
export const ERROR_UPDATE_SPACE = 'updateSpaceAPIError';
export const ERROR_UPDATE_SPACE_USER = 'updateSpaceUserAPIError';
export const ERROR_GET_USER_APPS = 'getUserAppsAPIError';
export const ERROR_ADD_APP_USER = 'addAppUserAPIError';
export const ERROR_DELETE_APP_USER = 'deleteAppUserAPIError';
export const ERROR_DELETE_APP = 'deleteAppAPIError';

// subscription termination error pattern
export const SUBSCRIPTION_FATAL_ERROR = new RegExp('.*AppSync Realtime subscription init error.*');

// vpn client download links
export const vpnClientURLs: { [ vpnType: string ]: string} = {
  'wireguard': 'https://www.wireguard.com/install/',
}
