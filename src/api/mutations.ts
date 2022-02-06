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
          isEgressNode
          status
          bytesUploaded
          bytesDownloaded
          lastConnectTime
        }
      }
      universalConfig
    }
  }
`;
export const updateUserConfig = /* GraphQL */ `
  mutation UpdateUserConfig($universalConfig: String!) {
    updateUserConfig(universalConfig: $universalConfig) {
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
      universalConfig
    }
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
export const addDeviceUser = /* GraphQL */ `
  mutation AddDeviceUser($deviceID: ID!) {
    addDeviceUser(deviceID: $deviceID) {
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
export const updateDeviceKey = /* GraphQL */ `
  mutation UpdateDeviceKey($deviceID: ID!, $deviceKey: Key!) {
    updateDeviceKey(deviceID: $deviceID, deviceKey: $deviceKey) {
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
export const deleteDevice = /* GraphQL */ `
  mutation DeleteDevice($deviceID: ID!) {
    deleteDevice(deviceID: $deviceID)
  }
`;
export const addSpace = /* GraphQL */ `
  mutation AddSpace(
    $spaceName: String!
    $spaceKey: Key!
    $recipe: String!
    $iaas: String!
    $region: String!
    $isEgressNode: Boolean!
  ) {
    addSpace(
      spaceName: $spaceName
      spaceKey: $spaceKey
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
export const inviteSpaceUser = /* GraphQL */ `
  mutation InviteSpaceUser(
    $spaceID: ID!
    $userID: ID!
    $isAdmin: Boolean!
    $isEgressNode: Boolean!
  ) {
    inviteSpaceUser(
      spaceID: $spaceID
      userID: $userID
      isAdmin: $isAdmin
      isEgressNode: $isEgressNode
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
        users {
          totalCount
        }
      }
    }
  }
`;
export const deleteSpaceUser = /* GraphQL */ `
  mutation DeleteSpaceUser($spaceID: ID!, $userID: ID!) {
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
        users {
          totalCount
        }
      }
    }
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
export const pushSpaceUsersUpdate = /* GraphQL */ `
  mutation PushSpaceUsersUpdate($data: String!) {
    pushSpaceUsersUpdate(data: $data) {
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
export const pushAppsUpdate = /* GraphQL */ `
  mutation PushAppsUpdate($data: String!) {
    pushAppsUpdate(data: $data) {
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
export const pushAppUsersUpdate = /* GraphQL */ `
  mutation PushAppUsersUpdate($data: String!) {
    pushAppUsersUpdate(data: $data) {
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
