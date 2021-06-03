/**
 * User space presentation types
 */

export type DeviceUserListItem = {
  userID: string,
  userName: string,
  fullName: string,
  status: string,
  bytesUploaded: string,
  bytesDownloaded: string,
  lastAccessTime: string
}

export type SpaceUserListItem = {
  userID: string,
  userName: string,
  fullName: string,
  status: string,
  bytesUploaded: string,
  bytesDownloaded: string,
  lastConnectTime: string
}
