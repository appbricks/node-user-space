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
        settings
        managedBy
        managedDevices {
          deviceID
          deviceName
          deviceType
          clientVersion
          publicKey
          certificate
          settings
          managedBy
        }
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
        }
      }
      apps {
        pageInfo {
          hasNextPage
          hasPreviousePage
        }
        totalCount
        appUsers {
          isOwner
          lastAccessTime
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
        settings
        managedBy
        managedDevices {
          deviceID
          deviceName
          deviceType
          clientVersion
          publicKey
          certificate
          settings
          managedBy
        }
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
        apps {
          totalCount
        }
        universalConfig
      }
      isOwner
      status
      bytesUploaded
      bytesDownloaded
      lastAccessTime
      lastConnectSpace {
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
        apps {
          totalCount
        }
        users {
          totalCount
        }
        status
        lastSeen
      }
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
        apps {
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
          isOwner
          lastAccessTime
        }
      }
      lastConnectTime
      lastConnectDevice {
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
        managedBy
        managedDevices {
          deviceID
          deviceName
          deviceType
          clientVersion
          publicKey
          certificate
          settings
          managedBy
        }
        users {
          totalCount
        }
      }
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
        settings
        managedBy
        managedDevices {
          deviceID
          deviceName
          deviceType
          clientVersion
          publicKey
          certificate
          settings
          managedBy
        }
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
        apps {
          totalCount
        }
        universalConfig
      }
      isOwner
      status
      bytesUploaded
      bytesDownloaded
      lastAccessTime
      lastConnectSpace {
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
        apps {
          totalCount
        }
        users {
          totalCount
        }
        status
        lastSeen
      }
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
        apps {
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
          isOwner
          lastAccessTime
        }
      }
      lastConnectTime
      lastConnectDevice {
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
        managedBy
        managedDevices {
          deviceID
          deviceName
          deviceType
          clientVersion
          publicKey
          certificate
          settings
          managedBy
        }
        users {
          totalCount
        }
      }
    }
  }
`;
