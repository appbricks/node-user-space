/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const userUpdates = /* GraphQL */ `
  subscription UserUpdates($userID: ID!) {
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
    }
  }
`;
export const deviceUpdates = /* GraphQL */ `
  subscription DeviceUpdates($deviceID: ID!) {
    deviceUpdates(deviceID: $deviceID) {
      deviceID
      numUsers
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
export const deviceUserUpdates = /* GraphQL */ `
  subscription DeviceUserUpdates($deviceID: ID!, $userID: ID!) {
    deviceUserUpdates(deviceID: $deviceID, userID: $userID) {
      deviceID
      userID
      deviceUser {
        device {
          deviceID
          deviceName
          deviceType
          clientVersion
          publicKey
          certificate
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
          vpnType
          localCARoot
          status
          lastSeen
        }
      }
    }
  }
`;
export const spaceUpdates = /* GraphQL */ `
  subscription SpaceUpdates($spaceID: ID!) {
    spaceUpdates(spaceID: $spaceID) {
      spaceID
      numUsers
      numApps
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
export const spaceUserUpdates = /* GraphQL */ `
  subscription SpaceUserUpdates($spaceID: ID!, $userID: ID!) {
    spaceUserUpdates(spaceID: $spaceID, userID: $userID) {
      spaceID
      userID
      spaceUser {
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
          ipAddress
          fqdn
          port
          vpnType
          localCARoot
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
        lastConnectDevice {
          deviceID
          deviceName
          deviceType
          clientVersion
          publicKey
          certificate
        }
      }
    }
  }
`;
export const appUpdates = /* GraphQL */ `
  subscription AppUpdates($appID: ID!) {
    appUpdates(appID: $appID) {
      appID
      numUsers
      app {
        appID
        appName
        recipe
        iaas
        region
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
          ipAddress
          fqdn
          port
          vpnType
          localCARoot
          status
          lastSeen
        }
        users {
          totalCount
        }
      }
    }
  }
`;
export const appUserUpdates = /* GraphQL */ `
  subscription AppUserUpdates($appID: ID!, $userID: ID!) {
    appUserUpdates(appID: $appID, userID: $userID) {
      appID
      userID
      appUser {
        app {
          appID
          appName
          recipe
          iaas
          region
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
          universalConfig
        }
        lastAccessTime
      }
    }
  }
`;
