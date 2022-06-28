jest.setTimeout(120000);

import {
  User,
  UserRef,
  Device,
  Space,
  SpaceUser,
  App,
  AppStatus,
  UserSearchFilterInput,
  UserSearchQuery,
  AddDeviceMutation,
  AddDeviceMutationVariables,
  AddDeviceUserMutationVariables,
  AddSpaceMutation,
  AddSpaceMutationVariables,
  AddAppMutation,
  AddAppMutationVariables,
  UserUpdate
} from '../../../../model/types';

import { userSearch } from '../../../../api/queries';
import {
  addDevice,
  addDeviceUser,
  deleteDevice,
  addSpace,
  deleteSpace,
  addApp,
  deleteApp
} from '../../../../api/mutations';

import Provider from '../provider';

// these tests are done end-to-end and require
// a pre-confgured cognito user pool accessible 
// over the wire. it is important that the web
// client app is configured to allow 
// USER_PASSWORD_AUTH due to a cryptographic
// issue when running from a local node
// runtime.

// https://github.com/aws-amplify/amplify-js/issues/1181
import 'crypto-js/lib-typedarrays';

import { 
  Amplify,
  Auth, 
  API, 
  graphqlOperation,
} from 'aws-amplify';

import awsconfig from '../../../../../etc/aws-exports';
Amplify.configure(awsconfig);

// it appears USER_SRP_AUTH still fails when run within 
// tests. so fall back is to do password auth which is 
// not recommendation in prod ready app code. USER_SRP_AUTH
// works fine from the browser.
Auth.configure({
  authenticationFlowType: 'USER_PASSWORD_AUTH',
})

// need to use id token as auth header instead of access
// token as the access token defaults to scope 
// 'aws.cognito.signin.user.admin' which does not provide
// the user id claim required by the API.
// 
// https://github.com/aws-amplify/amplify-js/issues/1370
// https://github.com/aws-amplify/amplify-js/issues/3326
Amplify.configure({
  API: {
    graphql_headers: async () => {
      const session = await Auth.currentSession();
      return {
        Authorization: session.getIdToken().getJwtToken(),
      };
    },
  },
});

import { 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
  sleep 
} from '@appbricks/utils';
import { exec, execSync } from 'child_process';

// set log levels
if (process.env.DEBUG) {
  // Amplify.Logger.LOG_LEVEL = 'DEBUG';
  setLogLevel(LOG_LEVEL_TRACE);
}

const provider = new Provider(undefined, false);

// The following tests depend on record kept data 
// in the User-Space database. These tests will
// fail if the expected dataset is not the
// same in the backend.

const tester1 = {
  userID: '8353aa68-80ba-48fb-8594-7a1e871d9f79',
  userName: 'tester1'
};
const tester1Ref = <UserRef>{
  userID: tester1.userID,
  userName: tester1.userName,
  firstName: null,
  middleName: null,
  familyName: null
}
const tester2 = {
  userID: 'd5b09bef-9c57-4049-a2b3-f8eb7cd43a07',
  userName: 'tester2'
};
const tester2Ref = <UserRef>{
  userID: tester2.userID,
  userName: tester2.userName,
  firstName: null,
  middleName: null,
  familyName: null
}
const tester3 = {
  userID: '9db68649-fcd1-4612-a08c-4d148f1637f2',
  userName: 'tester3'
};
const tester3Ref = <UserRef>{
  userID: tester3.userID,
  userName: tester3.userName,
  firstName: null,
  middleName: null,
  familyName: null
}

const userWithNullNameFields = (user: object) => {
  const nullName = {
    firstName: null,
    middleName: null,
    familyName: null  
  }
  return Object.assign(nullName, user);
}

let device1: Device;
let device2: Device;
let space1: Space;
let space2: Space;
let app1: App;
let app2: App;

it('searches for users with a name that has a given prefix', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  const result = <{data: UserSearchQuery}> await API.graphql(
    graphqlOperation(userSearch, {
      filter: <UserSearchFilterInput>{
        userName: 'je',
      },
      limit: 10
    }
  ));
  expect(await provider.userSearch('je')).toEqual(result.data.userSearch);
});

it('retrieves a user\'s devices', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  expect(await provider.getUserDevices())
    .toMatchObject([
      {
        isOwner: true,
        status: 'active',
        user: { userID: tester1.userID },
        device: {
          ...device1,
          users: {
            totalCount: 3,
            deviceUsers: [
              {
                user: userWithNullNameFields(tester1),
                isOwner: true,
                status: 'active',                
                bytesDownloaded: 0,
                bytesUploaded: 0,
                lastAccessTime: 0,
                lastConnectSpace: null
              },
              {
                user: userWithNullNameFields(tester2),
                isOwner: false,
                status: 'pending',                
                bytesDownloaded: 0,
                bytesUploaded: 0,
                lastAccessTime: 0,
                lastConnectSpace: null
              },
              {
                user: userWithNullNameFields(tester3),
                isOwner: false,
                status: 'pending',                
                bytesDownloaded: 0,
                bytesUploaded: 0,
                lastAccessTime: 0,
                lastConnectSpace: null
              }
            ]
          }
        }
      },
      {
        isOwner: true,
        status: 'active',
        bytesUploaded: 0,
        bytesDownloaded: 0,
        lastAccessTime: 0,
        lastConnectSpace: null,
        user: { userID: tester1.userID },
        device: {
          ...device2,
          users: {
            totalCount: 1,
            deviceUsers: [
              {
                user: userWithNullNameFields(tester1),
                isOwner: true,
                status: 'active',                
                bytesDownloaded: 0,
                bytesUploaded: 0,
                lastAccessTime: 0,
                lastConnectSpace: null
              }
            ]
          }
        }
      }
    ]);
});

it('retrieves device access requests for user\'s device', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  expect(
    (await provider.getDeviceAccessRequests(device1.deviceID!))
      .sort((u1, u2) => u1.user!.userName! < u2.user!.userName! ? -1 : 1)
  )
    .toEqual([
      {
        user: tester2
      },
      {
        user: tester3
      }
    ]);
});

it('approves an access request for a device', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  expect(await provider.activateDeviceUser(device1.deviceID!, tester3.userID))
    .toEqual(
      {
        device: {
          deviceID: device1.deviceID,
          deviceName: device1.deviceName
        },
        user: tester3,
        status: 'active'
      }
    );

  // should return remaining access requests
  expect(await provider.getDeviceAccessRequests(device1.deviceID!))
    .toEqual([
      {
        user: tester2
      }
    ]);
});

it('removes a user\'s access to a device', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  let deviceUser = (await provider.getUserDevices())
    .find(deviceUser => deviceUser!.device!.deviceID == device1.deviceID);
  expect(deviceUser).toBeDefined();

  expect(deviceUser!.device!.users!.deviceUsers!
    .find(deviceUser => deviceUser!.user!.userID == tester3.userID)
  ).toBeDefined();

  expect(await provider.deleteDeviceUser(device1.deviceID!, tester3.userID))
    .toEqual(
      {
        device: {
          deviceID: device1.deviceID,
          deviceName: device1.deviceName
        },
        user: tester3,
        status: 'active'
      }
    );

  deviceUser = (await provider.getUserDevices())
    .find(deviceUser => deviceUser!.device!.deviceID == device1.deviceID);
  expect(deviceUser).toBeDefined();

  expect(deviceUser!.device!.users!.deviceUsers!
    .find(deviceUser => deviceUser!.user!.userID == tester3.userID)
  ).toBeUndefined();
})

it('deletes a users\'s device', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await provider.deleteDevice(device1.deviceID!);

  // should return remaining device only
  expect(await provider.getUserDevices())
    .toMatchObject([
      {
        isOwner: true,
        status: 'active',
        user: { userID: tester1.userID },
        device: {
          ...device2,
          users: {
            totalCount: 1,
            deviceUsers: [
              {
                user: userWithNullNameFields(tester1),
                isOwner: true,
                status: 'active',                
                bytesDownloaded: 0,
                bytesUploaded: 0,
                lastAccessTime: 0,
                lastConnectSpace: null
              }
            ]
          }
        }
      }
    ]);
});

it('updates a users\'s device', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await provider.updateDevice(
    device2.deviceID!, 
    {
      publicKey: 'pub112',
      certificateRequest: 'csr112'
    },
    'client/ios:arm64/1.8.0',
    '{"someSetting":"someValue"}'
  );

  // should return remaining device only
  expect((await provider.getUserDevices()).find(du => du.device!.deviceID == device2.deviceID))
    .toMatchObject({
      device: {
        ...device2,
        publicKey: 'pub112',
        clientVersion: 'client/ios:arm64/1.8.0',
        settings: '{"someSetting":"someValue"}'  
      }
    });
});

it('retrieves a user\'s spaces', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  expect(trimSpaceUsersAndApps(await provider.getUserSpaces()))
    .toMatchObject([
      {
        isOwner: true,
        isAdmin: true,
        canUseSpaceForEgress: true,
        enableSiteBlocking: false,
        status: 'active',
        user: { userID: tester1.userID },
        space: space1
      },
      {
        isOwner: true,
        isAdmin: true,
        canUseSpaceForEgress: true,
        enableSiteBlocking: false,
        status: 'active',
        user: { userID: tester1.userID },
        space: space2
      }
    ]);
});

it('invites users and takes them through the space association lifecycle', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  // trim space fields
  const space = trimSpaceProps(space2);

  expect(await provider.inviteSpaceUser(space.spaceID!, tester2.userID!, 
    { 
      isSpaceAdmin: true,
      canUseSpaceForEgress: true,
      enableSiteBlocking: false
    }))
    .toEqual({
      space,
      user: tester2,
      isOwner: false,
      isAdmin: true,
      canUseSpaceForEgress: true,
      enableSiteBlocking: false,
      status: 'pending'
    });
  expect(await provider.inviteSpaceUser(space.spaceID!, tester3.userID!, 
    { 
      isSpaceAdmin: false,
      canUseSpaceForEgress: false,
      enableSiteBlocking: true
    }))
    .toEqual({
      space,
      user: tester3,
      isOwner: false,
      isAdmin: false,
      canUseSpaceForEgress: false,
      enableSiteBlocking: true,
      status: 'pending'
    });

  // get invitations created from within 
  // the respective user accounts

  const spaceInvitedTo = (({ spaceID, spaceName, recipe, iaas, region, version }) => 
    { return { spaceID, spaceName, recipe, iaas, region, version } })(space2);

  await Auth.signOut();
  await Auth.signIn('tester2', '@ppBr!cks2020');
  expect(await provider.getSpaceInvitations())
    .toEqual([{
      space: spaceInvitedTo,
      isAdmin: true,
      canUseSpaceForEgress: true,
      enableSiteBlocking: false
    }]);

  await Auth.signOut();
  await Auth.signIn('tester3', '@ppBr!cks2020');
  expect(trimSpaceUsersAndApps(await provider.getUserSpaces()))
    .toMatchObject([
      {
        isOwner: false,
        isAdmin: false,
        canUseSpaceForEgress: false,
        enableSiteBlocking: true,
        status: 'pending',
        user: { userID: tester3.userID },
        space: (s => { return { ...s, admins: [ tester1Ref ]}})(space2)
      }
    ]);
  expect(await provider.getSpaceInvitations())
    .toEqual([{
      space: spaceInvitedTo,
      isAdmin: false,
      canUseSpaceForEgress: false,
      enableSiteBlocking: true
    }]);
  expect(await provider.acceptSpaceUserInvitation(space2.spaceID!))
    .toEqual({
      space,
      user: tester3
    });
  expect(trimSpaceUsersAndApps(await provider.getUserSpaces()))
    .toMatchObject([
      {
        isOwner: false,
        isAdmin: false,
        canUseSpaceForEgress: false,
        enableSiteBlocking: true,
        status: 'active',
        user: { userID: tester3.userID },
        space: (s => { return { ...s, admins: [ tester1Ref ]}})(space2)
      }
    ]);
  expect(await provider.leaveSpaceUser(space2.spaceID!))
    .toEqual({
      space,
      user: tester3
    });
  expect(trimSpaceUsersAndApps(await provider.getUserSpaces()))
    .toMatchObject([
      {
        isOwner: false,
        isAdmin: false,
        canUseSpaceForEgress: false,
        enableSiteBlocking: true,
        status: 'inactive',
        user: { userID: tester3.userID },
        space: (s => { return { ...s, admins: [ tester1Ref ]}})(space2)
      }
    ]);
});

it('deactivates a user associated with a space', async () => {

  // trim space fields
  const space = trimSpaceProps(space2);

  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');
  expect(await provider.deactivateSpaceUser(space.spaceID!, tester2.userID))
    .toEqual({
      space,
      user: tester2
    });
  
  await Auth.signOut();
  await Auth.signIn('tester2', '@ppBr!cks2020');
  expect(trimSpaceUsersAndApps(await provider.getUserSpaces()))
    .toMatchObject([
      {
        isOwner: false,
        isAdmin: true,
        canUseSpaceForEgress: true,
        enableSiteBlocking: false,
        status: 'inactive',
        user: { userID: tester2.userID },
        space: (s => { return { ...s, admins: [ tester1Ref ]}})(space2)
      }
    ]);
});

it('activates a user associated with a space', async () => {

  // trim space fields
  const space = trimSpaceProps(space2);

  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');
  expect(await provider.activateSpaceUser(space.spaceID!, tester2.userID))
    .toEqual({
      space,
      user: tester2
    });
  
  await Auth.signOut();
  await Auth.signIn('tester2', '@ppBr!cks2020');
  expect(trimSpaceUsersAndApps(await provider.getUserSpaces()))
    .toMatchObject([
      {
        isOwner: false,
        isAdmin: true,
        canUseSpaceForEgress: true,
        enableSiteBlocking: false,
        status: 'active',
        user: { userID: tester2.userID },
        space: (s => { return { ...s, admins: [ tester1Ref, tester2Ref ]}})(space2)
      }
    ]);  
});

it('deletes a user associated with a space', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  // trim space fields
  const space = trimSpaceProps(space2);

  expect(await provider.deleteSpaceUser(space.spaceID!, tester2.userID))
    .toEqual({
      space,
      user: tester2
    });

  await Auth.signOut();
  await Auth.signIn('tester2', '@ppBr!cks2020');
  expect(trimSpaceUsersAndApps(await provider.getUserSpaces()))
    .toEqual([]);
});

it('deletes a user\'s space', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await provider.deleteSpace(space1.spaceID!);
  
  // expect only remaining space
  expect(trimSpaceUsersAndApps(await provider.getUserSpaces()))
    .toMatchObject([
      {
        isOwner: true,
        isAdmin: true,
        status: 'active',
        user: { userID: tester1.userID },
        space: space2
      }
    ]);
});

it('updates a users\'s space', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await provider.updateSpace(
    space2.spaceID!, 
    {
      publicKey: 'pub222',
      certificateRequest: 'csr222'
    },
    '2.2.2',
    '{"someSetting":"someValue"}'
  );

  // should return remaining device only
  expect((await provider.getUserSpaces()).find(su => su.space!.spaceID == space2.spaceID))
    .toMatchObject({
      space: {
        ...space2,
        publicKey: 'pub222',
        version: '2.2.2',
        settings: '{"someSetting":"someValue"}'  
      }
    });
});

it('updates a users\'s space association', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await provider.updateSpaceUser(
    space2.spaceID!, 
    undefined,
    { 
      canUseSpaceForEgress: false,
      enableSiteBlocking: true
    }
  );

  // should return remaining device only
  expect((await provider.getUserSpaces()).find(su => su.space!.spaceID == space2.spaceID))
    .toMatchObject({
      canUseSpaceForEgress: false,
      enableSiteBlocking: true
    });
});

it('retrieves a user\'s space apps', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  expect(await provider.getUserApps())
    .toMatchObject([
      {
        app: {
          ...app1,
          space: { spaceID: space2.spaceID, spaceName: space2.spaceName },
          users: {
            appUsers: [ { 
              user: { userID: tester1.userID, userName: tester1.userName  }
            } ]
          }
        }
      },
      {
        app: {
          ...app2,
          space: { spaceID: space2.spaceID, spaceName: space2.spaceName },
          users: {
            appUsers: [ {
              user: { userID: tester1.userID, userName: tester1.userName  }
            } ]
          }
        }
      }
    ]);
});

it('adds an app user to a user\'s space app, deletes the user and then the space', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  // activate user invited to space in previous test
  // await provider.inviteSpaceUser(space2.spaceID!, tester3.userID!, { isSpaceAdmin: true })
  await provider.activateSpaceUser(space2.spaceID!, tester3.userID)

  // add user to app
  expect(await provider.addAppUser(app1.appID!, tester3.userID))
    .toMatchObject({
      app: { appID: app1.appID, appName: app1.appName },
      user: { userID: tester3.userID, userName: tester3.userName }
    })
  expect(await provider.getUserApps())
    .toMatchObject([
      {
        app: {
          ...app1,
          space: { spaceID: space2.spaceID, spaceName: space2.spaceName },
          users: {
            appUsers: [ { 
              user: { userID: tester1.userID, userName: tester1.userName  },
              isOwner: true
            }, { 
              user: { userID: tester3.userID, userName: tester3.userName  },
              isOwner: false
            } ]
          }
        }
      },
      { app: app2 }
    ]);
  // delete user from app
  expect(await provider.deleteAppUser(app1.appID!, tester3.userID))
    .toMatchObject({
      app: { appID: app1.appID, appName: app1.appName },
      user: { userID: tester3.userID, userName: tester3.userName }
    })
  expect(await provider.getUserApps())
    .toMatchObject([
      {
        app: {
          ...app1,
          space: { spaceID: space2.spaceID, spaceName: space2.spaceName },
          users: {
            appUsers: [ { 
              user: { userID: tester1.userID, userName: tester1.userName  },
              isOwner: true
            } ]
          }
        }
      },
      { app: app2 }
    ]);
  // delete app
  await provider.deleteApp(app1.appID!)
  expect(await provider.getUserApps())
    .toMatchObject([
      { app: app2 }
    ]);
});

it('subscribes to user updates', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await validateSubscription(
    `pushUsersUpdate(data: $data) {
      userID
      numDevices
      numSpaces
      user {
        userID
        userName
        firstName
        middleName
        familyName
        emailAddress
      }
    }`,
    JSON.stringify({
      "userID": tester1.userID,
      "userName": "user_$i",
      "firstName": "firstName_$i",
      "middleName": "middleName_$i",
      "familyName": "familyName_$i",
      "emailAddress": "emailAddress_$i@appbricks.io",
      "numDevices": 10,
      "numSpaces": 5
    }),
    // create valid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToUserUpdates(
        tester1.userID,
        update,
        error
      );
    },
    // validate update
    (data: UserUpdate, updateCount) => {
      if (data.numDevices == -1 || data.numSpaces == -1 || data.numApps == -1) return;
      expect(data.userID).toEqual(tester1.userID);
      expect(data.numDevices).toEqual(10);
      expect(data.numSpaces).toEqual(5);
      expect(data.user!.userID).toEqual(tester1.userID);
      expect(data.user!.userName).toMatch(/^user_[0-9]+$/);
      expect(data.user!.firstName).toMatch(/^firstName_[0-9]+$/);
      expect(data.user!.middleName).toMatch(/^middleName_[0-9]+$/);
      expect(data.user!.familyName).toMatch(/^familyName_[0-9]+$/);
      expect(data.user!.emailAddress).toMatch(/^emailAddress_[0-9]+@appbricks\.io$/);
    },
    // unsubscribe
    () => provider.unsubscribeFromUserUpdates(tester1.userID),
    // create an invalid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToUserUpdates(
        tester2.userID,
        update,
        error
      );
    },
    // error from invalid subscription request
    {"errors": [{"message": "Connection failed: {\"errors\":[{\"message\":\"Access denied\"}]}"}]}
  );
});

it('subscribes to device updates', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await validateSubscription(
    `pushDevicesUpdate(data: $data) {
      deviceID
      numUsers
      device {
        deviceID
        deviceName
        publicKey
        certificate  
      }
    }`, 
    JSON.stringify({
      "deviceID": device2.deviceID!,
      "deviceName": "deviceName_$i",
      "publicKey": "publicKey_$i",
      "certificate": "certificate_$i",
      "numUsers": 100
    }), 
    // create valid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToDeviceUpdates(
        device2.deviceID!,
        update,
        error
      );
    },
    // validate update
    (data, updateCount) => {
      if (data.numUsers == -1) return;
      expect(data.deviceID).toEqual(device2.deviceID!);
      expect(data.numUsers).toEqual(100);
      expect(data.device!.deviceID).toEqual(device2.deviceID!);
      expect(data.device!.deviceName).toMatch(/^deviceName_[0-9]+$/);
      expect(data.device!.publicKey).toMatch(/^publicKey_[0-9]+$/);
      expect(data.device!.certificate).toMatch(/^certificate_[0-9]+$/);
    },
    // unsubscribe
    () => provider.unsubscribeFromDeviceUpdates(device2!.deviceID!),
    // create an invalid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToDeviceUpdates(
        '56db9d67-6039-443c-a3e5-e35e2f8bed80',
        update,
        error
      );
    },
    // error from invalid subscription request
    {"errors": [{"message": "Connection failed: {\"errors\":[{\"message\":\"Given device was not found\"}]}"}]}
  );
});

it('subscribes to device user updates', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await validateSubscription(
    `pushDeviceUsersUpdate(data: $data) {
      deviceID
      userID
      deviceUser {
        status
        bytesUploaded
        bytesDownloaded
        lastAccessTime
        lastConnectSpace {
          spaceID
          spaceName
        }
      }
    }`, 
    JSON.stringify({
      "deviceID": device2.deviceID!, 
      "userID": tester1.userID, 
      "status": "active",
      "bytesUploaded": 100,
      "bytesDownloaded": 100,
      "lastAccessTime": Date.now(),
      "lastConnectSpaceID": space2.spaceID
    }), 
    // create valid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToDeviceUserUpdates(
        device2.deviceID!,
        tester1.userID,
        update,
        error
      );
    },
    // validate update
    (data, updateCount) => {
      expect(data.deviceID).toEqual(device2.deviceID!);
      expect(data.userID).toEqual(tester1.userID);
      expect(data.deviceUser.status).toEqual("active");
      expect(data.deviceUser.bytesUploaded).toEqual(100);
      expect(data.deviceUser.bytesDownloaded).toEqual(100);
      expect(data.deviceUser.lastAccessTime).toBeGreaterThan(0);
      expect(data.deviceUser.lastAccessTime).toBeLessThanOrEqual(Date.now());
      expect(data.deviceUser.lastConnectSpace?.spaceID).toEqual(space2.spaceID);
      expect(data.deviceUser.lastConnectSpace?.spaceName).toEqual(space2.spaceName);
    },
    // unsubscribe
    () => provider.unsubscribeFromDeviceUserUpdates(device2!.deviceID!, tester1.userID),
    // create an invalid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToDeviceUserUpdates(
        '56db9d67-6039-443c-a3e5-e35e2f8bed80',
        tester1.userID,
        update,
        error
      );
    },
    // error from invalid subscription request
    {"errors": [{"message": "Connection failed: {\"errors\":[{\"message\":\"Device is not associated with the current user\"}]}"}]}
  );
});

it('subscribes to space updates', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await validateSubscription(
    `pushSpacesUpdate(data: $data) {
      spaceID
      numUsers
      space {
        spaceID
        spaceName
        publicKey
        certificate
        recipe
        iaas
        region
        version
        isEgressNode  
      }
    }`, 
    JSON.stringify({
      "spaceID": space2.spaceID!,
      "spaceName": "spaceName_$i",
      "publicKey": "publicKey_$i",
      "certificate": "certificate_$i",
      "recipe": "recipe_$i",
      "iaas": "iaas_$i",
      "region": "region_$i",
      "version": "version_$i",
      "isEgressNode": false,
      "numUsers": 999
    }), 
    // create valid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToSpaceUpdates(
        space2.spaceID!,
        update,
        error
      );
    },
    // validate update
    (data, updateCount) => {
      if (data.numUsers == -1) return;
      expect(data.spaceID).toEqual(space2.spaceID!);
      expect(data.numUsers).toEqual(999);
      expect(data.space!.spaceID).toEqual(space2!.spaceID!);
      expect(data.space!.spaceName).toMatch(/^spaceName_[0-9]+$/);
      expect(data.space!.publicKey).toMatch(/^publicKey_[0-9]+$/);
      expect(data.space!.certificate).toMatch(/^certificate_[0-9]+$/);
      expect(data.space!.recipe).toMatch(/^recipe_[0-9]+$/);
      expect(data.space!.iaas).toMatch(/^iaas_[0-9]+$/);
      expect(data.space!.region).toMatch(/^region_[0-9]+$/);
      expect(data.space!.version).toMatch(/^version_[0-9]+$/);
      expect(data.space!.isEgressNode).toBeFalsy();
    },
    // unsubscribe
    () => provider.unsubscribeFromSpaceUpdates(space2!.spaceID!),
    // create an invalid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToSpaceUpdates(
        '5ed8679e-d684-4d54-9b4f-2e73f7f8d342',
        update,
        error
      );
    },
    // error from invalid subscription request
    {"errors": [{"message": "Connection failed: {\"errors\":[{\"message\":\"Given space was not found\"}]}"}]}
  );
});

it('subscribes to space user updates', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await validateSubscription(
    `pushSpaceUsersUpdate(data: $data) {
      spaceID
      userID
      spaceUser {
        status
        bytesUploaded
        bytesDownloaded
        lastConnectTime
        lastConnectDevice {
          deviceID
          deviceName
        }
      }
    }`, 
    JSON.stringify({
      "spaceID": space2.spaceID!,
      "userID": tester1.userID, 
      "status": "active",
      "bytesUploaded": 150,
      "bytesDownloaded": 150,
      "lastConnectTime": Date.now(),
      "lastConnectDeviceID": device2.deviceID
    }), 
    // create valid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToSpaceUserUpdates(
        space2.spaceID!,
        tester1.userID,
        update,
        error
      );
    },
    // validate update
    (data, updateCount) => {
      expect(data.spaceID).toEqual(space2.spaceID!);
      expect(data.userID).toEqual(tester1.userID);
      expect(data.spaceUser.status).toEqual("active");
      expect(data.spaceUser.bytesUploaded).toEqual(150);
      expect(data.spaceUser.bytesDownloaded).toEqual(150);
      expect(data.spaceUser.lastConnectTime).toBeGreaterThan(0);
      expect(data.spaceUser.lastConnectTime).toBeLessThanOrEqual(Date.now());
      expect(data.spaceUser.lastConnectDevice?.deviceID).toEqual(device2.deviceID);
      expect(data.spaceUser.lastConnectDevice?.deviceName).toEqual(device2.deviceName);
    },
    // unsubscribe
    () => provider.unsubscribeFromSpaceUserUpdates(space2!.spaceID!, tester1.userID),
    // create an invalid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToSpaceUserUpdates(
        '5ed8679e-d684-4d54-9b4f-2e73f7f8d342',
        tester1.userID,
        update,
        error
      );
    },
    // error from invalid subscription request
    {"errors": [{"message": "Connection failed: {\"errors\":[{\"message\":\"Space is not associated with the current user\"}]}"}]}
  );
});

it('subscribes to app updates', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await validateSubscription(
    `pushAppsUpdate(data: $data) {
      appID
      numUsers
      app {
        appID
        appName
        recipe
        iaas
        region
        version
        status
      }
    }`, 
    JSON.stringify({
      "appID": app2.appID!,
      "appName": "appName_$i",
      "recipe": "recipe_$i",
      "iaas": "iaas_$i",
      "region": "region_$i",
      "version": "version_$i",
      "status": [
        AppStatus.undeployed, 
        AppStatus.running,
        AppStatus.shutdown,
        AppStatus.pending,
        AppStatus.unknown
      ][Math.floor(Math.random() * 5)],
      "numUsers": 111
    }),
    // create valid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToAppUpdates(
        app2.appID!,
        update,
        error
      );
    },
    // validate update
    (data, updateCount) => {
      if (data.numUsers == -1) return;
      expect(data.appID).toEqual(app2.appID!);
      expect(data.numUsers).toEqual(111);
      expect(data.app!.appID).toEqual(app2.appID!);
      expect(data.app!.appName).toMatch(/^appName_[0-9]+$/);
      expect(data.app!.recipe).toMatch(/^recipe_[0-9]+$/);
      expect(data.app!.iaas).toMatch(/^iaas_[0-9]+$/);
      expect(data.app!.region).toMatch(/^region_[0-9]+$/);
      expect(data.app!.version).toMatch(/^version_[0-9]+$/);
      expect(data.app!.status).toMatch(/^(undeployed|running|shutdown|pending|unknown)$/);
    },
    // unsubscribe
    () => provider.unsubscribeFromAppUpdates(app2.appID!),
    // create an invalid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToAppUpdates(
        '808ebb50-7c9d-4b69-9c1b-622d26b918aa',
        update,
        error
      );
    },
    // error from invalid subscription request
    {"errors": [{"message": "Connection failed: {\"errors\":[{\"message\":\"Given app was not found\"}]}"}]}
  );
});

it('subscribes to app user updates', async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await validateSubscription(
    `pushAppUsersUpdate(data: $data) {
      appID
      userID
      appUser {
        lastAccessedTime
      }
    }`, 
    JSON.stringify({
      "appID": app2!.appID!,
      "userID": tester1.userID, 
      "lastAccessedTime": 82378237,
    }), 
    // create valid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToAppUserUpdates(
        app2.appID!,
        tester1.userID,
        update,
        error
      );
    },
    // validate update
    (data, updateCount) => {
      expect(data.appID).toEqual(app2.appID!);
      expect(data.userID).toEqual(tester1.userID);
      expect(data.appUser.lastAccessedTime).toEqual(82378237);
    },
    // unsubscribe
    () => provider.unsubscribeFromAppUserUpdates(app2!.appID!, tester1.userID),
    // create an invalid subscription
    (update: (data: any) => void, error: (error: any) => void) => {
      provider.subscribeToAppUserUpdates(
        '5ed8679e-d684-4d54-9b4f-2e73f7f8d342',
        tester1.userID,
        update,
        error
      );
    },
    // error from invalid subscription request
    {"errors": [{"message": "Connection failed: {\"errors\":[{\"message\":\"App is not associated with the current user\"}]}"}]}
  );
});

async function validateSubscription(
  mutation: string, 
  dataTmpl: string, 
  subscribe: (update: (data: any) => void, error: (error: any) => void) => void,
  validateSuccess: (data: any, updateCount: number) => void,
  unsubscribe: () => void,
  subscribeWithError: (update: (data: any) => void, error: (error: any) => void) => void,
  expectedError: any
) {
  // run push updates job. this requires the AWS credentials 
  // and App Sync URL to be set in the environment
  const pushCmd = `${process.argv[0]} ${__dirname}/push-update.js '${mutation}' '${dataTmpl}' 5`;

  let err: any;
  let updateCount = 0;

  const update = (data: any) => {
    updateCount++;
    // console.log('Update', {data: JSON.stringify(data), updateCount});
    validateSuccess(data, updateCount);
  };
  const error = (error: any) => {
    err = error;
    // console.log('Update Error', {data: JSON.stringify(error), updateCount});
  };

  // create a good subscription
  await subscribe(update, error);
  // wait for subscription to become active
  await sleep(500);
  expect(err).toBeUndefined();

  const pushCmdOut = execSync(pushCmd).toString();
  // console.log(`**** Begin Push results ****\n\n${pushCmdOut}\n\n**** End Push results ****`)
  
  // wait for updates to propagate to subscription
  await sleep(5000);
  expect(err).toBeUndefined();

  await unsubscribe();
  execSync(pushCmd)
  
  // wait updates to propagate to subscription
  await sleep(1000);
  expect(err).toBeUndefined();

  expect(updateCount).toEqual(5);

  // check for subscription error
  subscribeWithError(update, error);
  // wait for the error to propagate
  await sleep(500);
  expect(err).toEqual(expectedError);
}

// create test data
beforeAll(async() => {
  try {
    await Auth.signIn('tester1', '@ppBr!cks2020');

    device1 = (({ managedBy, ...d }) => { return { ...d, owner: tester1Ref }})(
      (<{data: AddDeviceMutation}> await API.graphql(
        graphqlOperation(addDevice, <AddDeviceMutationVariables>{
          deviceName: 'tester1\'s device #1',
          deviceInfo: {
            deviceType: 'MacBook',
            clientVersion: 'app/darwin:arm64/1.2.0'
          },
          deviceKey: {
            certificateRequest: 'csr101',
            publicKey: 'pub101'
          },
          accessKey: {
            wireguardPublicKey: 'wgtester100'
          }
        }
      ))).data.addDevice!.deviceUser!.device!
    );
    device2 = (({ managedBy, ...d }) => { return { ...d, owner: tester1Ref }})(
      (<{data: AddDeviceMutation}> await API.graphql(
        graphqlOperation(addDevice, <AddDeviceMutationVariables>{
          deviceName: 'tester1\'s device #2',
          deviceInfo: {
            deviceType: 'iPhone',
            clientVersion: 'client/ios:arm64/1.7.0'
          },
          deviceKey: {
            certificateRequest: 'csr102',
            publicKey: 'pub102'
          },
          accessKey: {
            wireguardPublicKey: 'wgtester100'
          }
        }
      ))).data.addDevice!.deviceUser!.device!
    );

    space1 = (({ vpnType, ...s }) => s)(
      (s => { return { ...s, owner: tester1Ref, admins: [ tester1Ref ] }})(
        (<{data: AddSpaceMutation}> await API.graphql(
          graphqlOperation(addSpace, <AddSpaceMutationVariables>{
            spaceName: 'tester1\'s space #1',
            spaceKey: {
              certificateRequest: 'csr201',
              publicKey: 'pub201'
            },
            recipe: 'recipe #1',
            iaas: 'aws',
            region: 'us-east-1',
            isEgressNode: true
          }
        ))).data.addSpace!.spaceUser!.space!
      )
    );
    space2 = (({ vpnType, ...s }) => s)(
      (s => { return { ...s, owner: tester1Ref, admins: [ tester1Ref ] }})(
        (<{data: AddSpaceMutation}> await API.graphql(
          graphqlOperation(addSpace, <AddSpaceMutationVariables>{
            spaceName: 'tester1\'s space #2',
            spaceKey: {
              certificateRequest: 'csr202',
              publicKey: 'pub202'
            },
            recipe: 'recipe #1',
            iaas: 'gcp',
            region: 'us-east1',
            isEgressNode: true
          }
        ))).data.addSpace!.spaceUser!.space!
      )
    );

    app1 = (({ space, users, ...a }) => a)(
      (<{data: AddAppMutation}> await API.graphql(
        graphqlOperation(addApp, <AddAppMutationVariables>{
          appName: 'tester1\'s app #1',
          recipe: 'recipe #1',
          iaas: 'aws',
          region: 'us-east-1',
          spaceID: space2.spaceID
        }
      ))).data.addApp!
    );
    app2 = (({ space, users, ...a }) => a)(
      (<{data: AddAppMutation}> await API.graphql(
        graphqlOperation(addApp, <AddAppMutationVariables>{
          appName: 'tester1\'s app #2',
          recipe: 'recipe #2',
          iaas: 'aws',
          region: 'us-east-1',
          spaceID: space2.spaceID
        }
      ))).data.addApp!
    );

    await Auth.signOut();
    await Auth.signIn('tester2', '@ppBr!cks2020');
    await API.graphql(
      graphqlOperation(addDeviceUser, <AddDeviceUserMutationVariables>{
        deviceID: device1.deviceID,
        accessKey: { 
          wireguardPublicKey: 'wgtester200'
        }
      }))

    await Auth.signOut();
    await Auth.signIn('tester3', '@ppBr!cks2020');
    await API.graphql(
      graphqlOperation(addDeviceUser, <AddDeviceUserMutationVariables>{
        deviceID: device1.deviceID,
        accessKey: { 
          wireguardPublicKey: 'wgtester300'
        }
      }))

  } catch (error) {
    console.log('Test data initialization ERROR!', JSON.stringify(error, null, 2))
    fail(error);
  }
});

afterAll(async () => {
  await Auth.signOut();
  await Auth.signIn('tester1', '@ppBr!cks2020');
  try { await API.graphql(graphqlOperation(deleteApp, { appID: app1.appID })); } catch (error) { }
  try { await API.graphql(graphqlOperation(deleteApp, { appID: app2.appID })); } catch (error) { }
  try { await API.graphql(graphqlOperation(deleteSpace, { spaceID: space1.spaceID })); } catch (error) {}
  try { await API.graphql(graphqlOperation(deleteSpace, { spaceID: space2.spaceID })); } catch (error) {}
  try { await API.graphql(graphqlOperation(deleteDevice, { deviceID: device1.deviceID })); } catch (error) {}
  try { await API.graphql(graphqlOperation(deleteDevice, { deviceID: device2.deviceID })); } catch (error) {}
});

const trimUserProps = (user: User) => <User>{ userID: user.userID, userName: user.userName };
const trimSpaceProps = (space: Space) => <Space>{ spaceID: space.spaceID, spaceName: space.spaceName };

const trimSpaceUsersAndApps = (spaceUsers: SpaceUser[]) => 
  spaceUsers.map(spaceUser => ({ 
    ...spaceUser,
    space: (({ users, apps, ...s }) => s)(<Space>spaceUser.space), 
  }));
