/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const userUpdates = /* GraphQL */ `
  subscription UserUpdates($userID: ID!) {
    userUpdates(userID: $userID) {
      userID
      numDevices
      numSpaces
      numApps
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
          settings
          managedBy
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
        spaceConfigs {
          viewed
          wgConfigName
          wgConfig
          wgConfigExpireAt
          wgInactivityExpireAt
          wgInactivityTimeout
        }
        bytesUploaded
        bytesDownloaded
        lastAccessTime
        lastConnectSpace {
          spaceID
          spaceName
          cookbook
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
          domainName
          vpnType
          localCARoot
          meshNetworkType
          meshNetworkBitmask
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
        cookbook
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
        domainName
        vpnType
        localCARoot
        meshNetworkType
        meshNetworkBitmask
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
          cookbook
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
          domainName
          vpnType
          localCARoot
          meshNetworkType
          meshNetworkBitmask
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
        canUseSpaceForEgress
        enableSiteBlocking
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
          settings
          managedBy
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
        cookbook
        recipe
        iaas
        region
        version
        publicKey
        certificate
        domainName
        port
        status
        lastSeen
        space {
          spaceID
          spaceName
          cookbook
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
          domainName
          vpnType
          localCARoot
          meshNetworkType
          meshNetworkBitmask
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
          cookbook
          recipe
          iaas
          region
          version
          publicKey
          certificate
          domainName
          port
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
        lastAccessedTime
      }
    }
  }
`;
