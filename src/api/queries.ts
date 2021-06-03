/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const userSearch = /* GraphQL */ `
  query UserSearch(
    $filter: TableUsersFilterInput!
    $limit: Int
    $next: CursorInput
  ) {
    userSearch(filter: $filter, limit: $limit, next: $next) {
      pageInfo {
        hasNextPage
        hasPreviousePage
        cursor {
          index
          nextTokens
        }
      }
      edges {
        node {
          userID
          userName
        }
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
      firstName
      middleName
      familyName
      preferredName
      emailAddress
      mobilePhone
      confirmed
      publicKey
      certificate
      certificateRequest
      devices {
        pageInfo {
          hasNextPage
          hasPreviousePage
        }
        totalCount
        deviceUsers {
          isOwner
          status
          wireguardPublicKey
          bytesUploaded
          bytesDownloaded
          lastAccessTime
        }
      }
      spaces {
        pageInfo {
          hasNextPage
          hasPreviousePage
        }
        totalCount
        spaceUsers {
          isOwner
          isAdmin
          isEgressNode
          status
          bytesUploaded
          bytesDownloaded
          lastConnectTime
          lastConnectDeviceID
        }
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
        users {
          totalCount
        }
      }
      user {
        userID
        userName
        firstName
        middleName
        familyName
        preferredName
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
      isOwner
      status
      wireguardPublicKey
      bytesUploaded
      bytesDownloaded
      lastAccessTime
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
        apps {
          totalCount
        }
        users {
          totalCount
        }
        status
        lastSeen
      }
      user {
        userID
        userName
        firstName
        middleName
        familyName
        preferredName
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
      isOwner
      isAdmin
      isEgressNode
      status
      bytesUploaded
      bytesDownloaded
      accessList {
        pageInfo {
          hasNextPage
          hasPreviousePage
        }
        totalCount
        appUsers {
          lastAccessTime
        }
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
        users {
          totalCount
        }
      }
      user {
        userID
        userName
        firstName
        middleName
        familyName
        preferredName
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
      isOwner
      status
      wireguardPublicKey
      bytesUploaded
      bytesDownloaded
      lastAccessTime
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
        apps {
          totalCount
        }
        users {
          totalCount
        }
        status
        lastSeen
      }
      user {
        userID
        userName
        firstName
        middleName
        familyName
        preferredName
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
      isOwner
      isAdmin
      isEgressNode
      status
      bytesUploaded
      bytesDownloaded
      accessList {
        pageInfo {
          hasNextPage
          hasPreviousePage
        }
        totalCount
        appUsers {
          lastAccessTime
        }
      }
      lastConnectTime
      lastConnectDeviceID
    }
  }
`;
