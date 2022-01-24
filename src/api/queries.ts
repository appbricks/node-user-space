/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const userSearch = /* GraphQL */ `
  query UserSearch($filter: UserSearchFilterInput!, $limit: Int) {
    userSearch(filter: $filter, limit: $limit) {
      userID
      userName
      firstName
      middleName
      familyName
    }
  }
`;
export const authDevice = /* GraphQL */ `
  query AuthDevice($idKey: String!) {
    authDevice(idKey: $idKey) {
      accessType
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
        users {
          totalCount
        }
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
          lastSpaceConnectedTo
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
      lastSpaceConnectedTo
    }
  }
`;
export const getSpace = /* GraphQL */ `
  query GetSpace($spaceID: ID!) {
    getSpace(spaceID: $spaceID) {
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
        recipe
        iaas
        region
        version
        publicKey
        certificate
        isEgressNode
        ipAddress
        fqdn
        port
        localCARoot
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
      lastSpaceConnectedTo
    }
  }
`;
export const getSpaceInvitations = /* GraphQL */ `
  query GetSpaceInvitations {
    getSpaceInvitations {
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
        recipe
        iaas
        region
        version
        publicKey
        certificate
        isEgressNode
        ipAddress
        fqdn
        port
        localCARoot
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
