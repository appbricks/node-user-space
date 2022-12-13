/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateUserKey = /* GraphQL */ `
  mutation UpdateUserKey($userKey: Key!) {
    updateUserKey(userKey: $userKey) {
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
          canUseSpaceForEgress
          enableSiteBlocking
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
          lastAccessedTime
        }
      }
      universalConfig
    }
  }
`;
export const updateUserConfig = /* GraphQL */ `
  mutation UpdateUserConfig($universalConfig: String!, $asOf: String!) {
    updateUserConfig(universalConfig: $universalConfig, asOf: $asOf)
  }
`;
export const addDevice = /* GraphQL */ `
  mutation AddDevice(
    $deviceName: String!
    $deviceInfo: DeviceInfo!
    $deviceKey: Key!
  ) {
    addDevice(
      deviceName: $deviceName
      deviceInfo: $deviceInfo
      deviceKey: $deviceKey
    ) {
      idKey
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
export const addDeviceUser = /* GraphQL */ `
  mutation AddDeviceUser($deviceID: ID!, $userID: ID) {
    addDeviceUser(deviceID: $deviceID, userID: $userID) {
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
export const activateDeviceUser = /* GraphQL */ `
  mutation ActivateDeviceUser($deviceID: ID!, $userID: ID!) {
    activateDeviceUser(deviceID: $deviceID, userID: $userID) {
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
export const deleteDeviceUser = /* GraphQL */ `
  mutation DeleteDeviceUser($deviceID: ID!, $userID: ID) {
    deleteDeviceUser(deviceID: $deviceID, userID: $userID) {
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
export const deleteDevice = /* GraphQL */ `
  mutation DeleteDevice($deviceID: ID!) {
    deleteDevice(deviceID: $deviceID)
  }
`;
export const updateDevice = /* GraphQL */ `
  mutation UpdateDevice(
    $deviceID: ID!
    $deviceKey: Key
    $clientVersion: String
    $settings: String
  ) {
    updateDevice(
      deviceID: $deviceID
      deviceKey: $deviceKey
      clientVersion: $clientVersion
      settings: $settings
    ) {
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
      users {
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
    }
  }
`;
export const addSpace = /* GraphQL */ `
  mutation AddSpace(
    $spaceName: String!
    $spaceKey: Key!
    $cookbook: String!
    $recipe: String!
    $iaas: String!
    $region: String!
    $isEgressNode: Boolean!
  ) {
    addSpace(
      spaceName: $spaceName
      spaceKey: $spaceKey
      cookbook: $cookbook
      recipe: $recipe
      iaas: $iaas
      region: $region
      isEgressNode: $isEgressNode
    ) {
      idKey
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
export const inviteSpaceUser = /* GraphQL */ `
  mutation InviteSpaceUser(
    $spaceID: ID!
    $userID: ID!
    $isAdmin: Boolean
    $canUseSpaceForEgress: Boolean
    $enableSiteBlocking: Boolean
  ) {
    inviteSpaceUser(
      spaceID: $spaceID
      userID: $userID
      isAdmin: $isAdmin
      canUseSpaceForEgress: $canUseSpaceForEgress
      enableSiteBlocking: $enableSiteBlocking
    ) {
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
      canUseSpaceForEgress
      enableSiteBlocking
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
          lastAccessedTime
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
export const activateSpaceUser = /* GraphQL */ `
  mutation ActivateSpaceUser($spaceID: ID!, $userID: ID!) {
    activateSpaceUser(spaceID: $spaceID, userID: $userID) {
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
      canUseSpaceForEgress
      enableSiteBlocking
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
          lastAccessedTime
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
export const deactivateSpaceUser = /* GraphQL */ `
  mutation DeactivateSpaceUser($spaceID: ID!, $userID: ID!) {
    deactivateSpaceUser(spaceID: $spaceID, userID: $userID) {
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
      canUseSpaceForEgress
      enableSiteBlocking
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
          lastAccessedTime
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
export const deleteSpaceUser = /* GraphQL */ `
  mutation DeleteSpaceUser($spaceID: ID!, $userID: ID) {
    deleteSpaceUser(spaceID: $spaceID, userID: $userID) {
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
      canUseSpaceForEgress
      enableSiteBlocking
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
          lastAccessedTime
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
export const deleteSpace = /* GraphQL */ `
  mutation DeleteSpace($spaceID: ID!) {
    deleteSpace(spaceID: $spaceID)
  }
`;
export const acceptSpaceUserInvitation = /* GraphQL */ `
  mutation AcceptSpaceUserInvitation($spaceID: ID!) {
    acceptSpaceUserInvitation(spaceID: $spaceID) {
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
      canUseSpaceForEgress
      enableSiteBlocking
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
          lastAccessedTime
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
export const leaveSpaceUser = /* GraphQL */ `
  mutation LeaveSpaceUser($spaceID: ID!) {
    leaveSpaceUser(spaceID: $spaceID) {
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
      canUseSpaceForEgress
      enableSiteBlocking
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
          lastAccessedTime
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
export const updateSpace = /* GraphQL */ `
  mutation UpdateSpace(
    $spaceID: ID!
    $spaceKey: Key
    $version: String
    $settings: String
  ) {
    updateSpace(
      spaceID: $spaceID
      spaceKey: $spaceKey
      version: $version
      settings: $settings
    ) {
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
      vpnType
      localCARoot
      meshNetworkType
      meshNetworkBitmask
      apps {
        pageInfo {
          hasNextPage
          hasPreviousePage
        }
        totalCount
        spaceApps {
          appID
          appName
          cookbook
          recipe
          iaas
          region
          version
          publicKey
          certificate
          status
          lastSeen
        }
      }
      users {
        pageInfo {
          hasNextPage
          hasPreviousePage
        }
        totalCount
        spaceUsers {
          isOwner
          isAdmin
          canUseSpaceForEgress
          enableSiteBlocking
          status
          bytesUploaded
          bytesDownloaded
          lastConnectTime
        }
      }
      status
      lastSeen
    }
  }
`;
export const updateSpaceUser = /* GraphQL */ `
  mutation UpdateSpaceUser(
    $spaceID: ID!
    $userID: ID
    $isAdmin: Boolean
    $canUseSpaceForEgress: Boolean
    $enableSiteBlocking: Boolean
  ) {
    updateSpaceUser(
      spaceID: $spaceID
      userID: $userID
      isAdmin: $isAdmin
      canUseSpaceForEgress: $canUseSpaceForEgress
      enableSiteBlocking: $enableSiteBlocking
    ) {
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
      canUseSpaceForEgress
      enableSiteBlocking
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
          lastAccessedTime
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
export const addApp = /* GraphQL */ `
  mutation AddApp(
    $appName: String!
    $appKey: Key!
    $cookbook: String!
    $recipe: String!
    $iaas: String!
    $region: String!
    $spaceID: ID!
  ) {
    addApp(
      appName: $appName
      appKey: $appKey
      cookbook: $cookbook
      recipe: $recipe
      iaas: $iaas
      region: $region
      spaceID: $spaceID
    ) {
      idKey
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
export const addAppUser = /* GraphQL */ `
  mutation AddAppUser($appID: ID!, $userID: ID!) {
    addAppUser(appID: $appID, userID: $userID) {
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
      lastAccessedTime
    }
  }
`;
export const deleteAppUser = /* GraphQL */ `
  mutation DeleteAppUser($appID: ID!, $userID: ID) {
    deleteAppUser(appID: $appID, userID: $userID) {
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
      lastAccessedTime
    }
  }
`;
export const deleteApp = /* GraphQL */ `
  mutation DeleteApp($appID: ID!) {
    deleteApp(appID: $appID)
  }
`;
export const publishData = /* GraphQL */ `
  mutation PublishData($data: [PublishDataInput!]!) {
    publishData(data: $data) {
      success
      error
    }
  }
`;
export const pushUsersUpdate = /* GraphQL */ `
  mutation PushUsersUpdate($data: String!) {
    pushUsersUpdate(data: $data) {
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
export const pushDevicesUpdate = /* GraphQL */ `
  mutation PushDevicesUpdate($data: String!) {
    pushDevicesUpdate(data: $data) {
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
export const pushDeviceUsersUpdate = /* GraphQL */ `
  mutation PushDeviceUsersUpdate($data: String!) {
    pushDeviceUsersUpdate(data: $data) {
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
export const pushSpacesUpdate = /* GraphQL */ `
  mutation PushSpacesUpdate($data: String!) {
    pushSpacesUpdate(data: $data) {
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
export const pushSpaceUsersUpdate = /* GraphQL */ `
  mutation PushSpaceUsersUpdate($data: String!) {
    pushSpaceUsersUpdate(data: $data) {
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
export const pushAppsUpdate = /* GraphQL */ `
  mutation PushAppsUpdate($data: String!) {
    pushAppsUpdate(data: $data) {
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
export const pushAppUsersUpdate = /* GraphQL */ `
  mutation PushAppUsersUpdate($data: String!) {
    pushAppUsersUpdate(data: $data) {
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
export const touchSubscriptions = /* GraphQL */ `
  mutation TouchSubscriptions($subs: [String!]) {
    touchSubscriptions(subs: $subs)
  }
`;
