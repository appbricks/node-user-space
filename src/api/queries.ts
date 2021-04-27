/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const userSearch = /* GraphQL */ `
  query UserSearch($filter: TableUsersFilterInput) {
    userSearch(filter: $filter) {
      pageInfo {
        hasNextPage
        hasPreviousePage
      }
      totalCount
      users {
        userID
        userName
      }
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser {
    getUser {
      userID
      userName
      emailAddress
      mobilePhone
      confirmed
      publicKey
      certificate
      certificateRequest
      devices {
        totalCount
      }
      spaces {
        totalCount
      }
      universalConfig
    }
  }
`;
export const getDevice = /* GraphQL */ `
  query GetDevice($deviceID: ID!) {
    getDevice(deviceID: $deviceID) {
      device {
        deviceID
        deviceName
        publicKey
        certificate
        certificateRequest
      }
      user {
        userID
        userName
        emailAddress
        mobilePhone
        confirmed
        publicKey
        certificate
        certificateRequest
        universalConfig
      }
      isOwner
      status
      wireguardPublicKey
      bytesUploaded
      bytesDownloaded
      lastConnectTime
    }
  }
`;
export const getSpace = /* GraphQL */ `
  query GetSpace($spaceID: ID!) {
    getSpace(spaceID: $spaceID) {
      space {
        spaceID
        spaceName
        recipe
        iaas
        region
        lastSeen
      }
      user {
        userID
        userName
        emailAddress
        mobilePhone
        confirmed
        publicKey
        certificate
        certificateRequest
        universalConfig
      }
      isOwner
      isAdmin
      isEgressNode
      status
      bytesUploaded
      bytesDownloaded
      accessList {
        totalCount
      }
      lastConnectTime
      lastConnectDeviceID
    }
  }
`;
export const getDeviceAccessRequests = /* GraphQL */ `
  query GetDeviceAccessRequests($deviceID: ID!) {
    getDeviceAccessRequests(deviceID: $deviceID) {
      device {
        deviceID
        deviceName
        publicKey
        certificate
        certificateRequest
      }
      user {
        userID
        userName
        emailAddress
        mobilePhone
        confirmed
        publicKey
        certificate
        certificateRequest
        universalConfig
      }
      isOwner
      status
      wireguardPublicKey
      bytesUploaded
      bytesDownloaded
      lastConnectTime
    }
  }
`;
export const getSpaceInvitations = /* GraphQL */ `
  query GetSpaceInvitations {
    getSpaceInvitations {
      space {
        spaceID
        spaceName
        recipe
        iaas
        region
        lastSeen
      }
      user {
        userID
        userName
        emailAddress
        mobilePhone
        confirmed
        publicKey
        certificate
        certificateRequest
        universalConfig
      }
      isOwner
      isAdmin
      isEgressNode
      status
      bytesUploaded
      bytesDownloaded
      accessList {
        totalCount
      }
      lastConnectTime
      lastConnectDeviceID
    }
  }
`;
