/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateUserKey = /* GraphQL */ `
  mutation UpdateUserKey($userKey: Key!) {
    updateUserKey(userKey: $userKey) {
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
export const addDevice = /* GraphQL */ `
  mutation AddDevice(
    $deviceName: String!
    $deviceKey: Key!
    $accessKey: WireguardKey!
  ) {
    addDevice(
      deviceName: $deviceName
      deviceKey: $deviceKey
      accessKey: $accessKey
    ) {
      idKey
      deviceUser {
        isOwner
        status
        wireguardPublicKey
        bytesUploaded
        bytesDownloaded
        lastConnectTime
      }
    }
  }
`;
export const addDeviceUser = /* GraphQL */ `
  mutation AddDeviceUser($deviceID: ID!, $accessKey: WireguardKey!) {
    addDeviceUser(deviceID: $deviceID, accessKey: $accessKey) {
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
export const activateDeviceUser = /* GraphQL */ `
  mutation ActivateDeviceUser($deviceID: ID!, $userID: ID!) {
    activateDeviceUser(deviceID: $deviceID, userID: $userID) {
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
export const updateDeviceKey = /* GraphQL */ `
  mutation UpdateDeviceKey($deviceID: ID!, $deviceKey: Key!) {
    updateDeviceKey(deviceID: $deviceID, deviceKey: $deviceKey) {
      deviceID
      deviceName
      publicKey
      certificate
      certificateRequest
      users {
        totalCount
      }
    }
  }
`;
export const updateDeviceUserKey = /* GraphQL */ `
  mutation UpdateDeviceUserKey(
    $deviceID: ID!
    $userID: ID
    $accessKey: WireguardKey!
  ) {
    updateDeviceUserKey(
      deviceID: $deviceID
      userID: $userID
      accessKey: $accessKey
    ) {
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
export const deleteDeviceUser = /* GraphQL */ `
  mutation DeleteDeviceUser($deviceID: ID!, $userID: ID) {
    deleteDeviceUser(deviceID: $deviceID, userID: $userID) {
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
export const deleteDevice = /* GraphQL */ `
  mutation DeleteDevice($deviceID: ID!) {
    deleteDevice(deviceID: $deviceID)
  }
`;
export const addSpace = /* GraphQL */ `
  mutation AddSpace(
    $spaceName: String!
    $recipe: String!
    $iaas: String!
    $region: String!
    $isEgressNode: Boolean!
  ) {
    addSpace(
      spaceName: $spaceName
      recipe: $recipe
      iaas: $iaas
      region: $region
      isEgressNode: $isEgressNode
    ) {
      idKey
      spaceUser {
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
export const acceptSpaceUserInvitation = /* GraphQL */ `
  mutation AcceptSpaceUserInvitation($spaceID: ID!) {
    acceptSpaceUserInvitation(spaceID: $spaceID) {
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
export const leaveSpaceUser = /* GraphQL */ `
  mutation LeaveSpaceUser($spaceID: ID!) {
    leaveSpaceUser(spaceID: $spaceID) {
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
export const deactivateSpaceUser = /* GraphQL */ `
  mutation DeactivateSpaceUser($spaceID: ID!, $userID: ID!) {
    deactivateSpaceUser(spaceID: $spaceID, userID: $userID) {
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
export const deleteSpaceUser = /* GraphQL */ `
  mutation DeleteSpaceUser($spaceID: ID!, $userID: ID!) {
    deleteSpaceUser(spaceID: $spaceID, userID: $userID) {
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
export const deleteSpace = /* GraphQL */ `
  mutation DeleteSpace($spaceID: ID!) {
    deleteSpace(spaceID: $spaceID)
  }
`;
