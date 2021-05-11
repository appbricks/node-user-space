jest.setTimeout(120000);

import {
  Device,
  Space,
  TableUsersFilterInput,
  UserSearchQuery,
  AddDeviceMutation,
  AddDeviceMutationVariables,
  AddDeviceUserMutationVariables,
  AddSpaceMutation,
  AddSpaceMutationVariables
} from '../../../../model/types';

import { userSearch } from '../../../../api/queries';
import {
  addDevice,
  addDeviceUser,
  deleteDevice,
  addSpace,
  deleteSpace
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

import Amplify, { 
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

// set log levels
if (process.env.DEBUG) {
  // Amplify.Logger.LOG_LEVEL = 'DEBUG';
  setLogLevel(LOG_LEVEL_TRACE);
}

const provider = new Provider();

// The following tests depend on record kept data 
// in the User-Space database. These test will
// fail if the expected dataset is not the
// same in the backend.

const tester1 = {
  userID: 'c821adc0-7bd0-41b6-a84a-ea609f6a34bc',
  userName: 'tester1'
};
const tester2 = {
  userID: '122d2f43-175f-410d-b3ee-9d93ba9cef2f',
  userName: 'tester2'
};
const tester3 = {
  userID: 'd68aef57-74db-450f-a6b2-d83285afc78c',
  userName: 'tester3'
};

let device1: Device;
let device2: Device;
let space1: Space;
let space2: Space;

it('searches for users with a name that has a given prefix', async () => {
  await Auth.signIn('tester1', '@ppBr!cks2020');

  const result = <{data: UserSearchQuery}> await API.graphql(
    graphqlOperation(userSearch, {
      filter: <TableUsersFilterInput>{
        userName: {
          beginsWith: 'je'
        }
      }
    }
  ));
  expect(await provider.userSearch('je')).toEqual(result.data.userSearch);
});

it('retrieves a user\'s devices', async () => {
  await Auth.signIn('tester1', '@ppBr!cks2020');

  expect(await provider.getUserDevices())
    .toEqual([
      {
        isOwner: true,
        status: 'active',
        device: {
          ...device1,
          users: {
            totalCount: 3,
            deviceUsers: [
              {
                user: tester1
              },
              {
                user: tester2
              },
              {
                user: tester3
              }
            ]
          }
        }
      },
      {
        isOwner: true,
        status: 'active',
        device: {
          ...device2,
          users: {
            totalCount: 1,
            deviceUsers: [
              {
                user: tester1
              }
            ]
          }
        }
      }
    ]);
});

it('retrieves device access requests for user\'s device', async () => {
  await Auth.signIn('tester1', '@ppBr!cks2020');

  expect(await provider.getDeviceAccessRequests(device1.deviceID!))
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

it('deletes a users\'s device', async () => {
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await provider.deleteDevice(device1.deviceID!);

  // should return remaining device only
  expect(await provider.getUserDevices())
    .toEqual([
      {
        isOwner: true,
        status: 'active',
        device: {
          ...device2,
          users: {
            totalCount: 1,
            deviceUsers: [
              {
                user: tester1
              }
            ]
          }
        }
      }
    ]);
});

it('retrieves a user\'s spaces', async () => {
  await Auth.signIn('tester1', '@ppBr!cks2020');

  expect(await provider.getUserSpaces())
    .toEqual([
      {
        isOwner: true,
        status: 'active',
        space: space1
      },
      {
        isOwner: true,
        status: 'active',
        space: space2
      }
    ]);
});

it('invites users and takes them through the space association lifecycle', async () => {
  await Auth.signIn('tester1', '@ppBr!cks2020');

  // trim space fields
  const space = (({ recipe, iaas, region, lastSeen, ...s }) => s)(space2);

  expect(await provider.inviteSpaceUser(space.spaceID!, tester2.userID!, true, true))
    .toEqual({
      space,
      user: tester2,
      isOwner: false,
      isAdmin: true,
      isEgressNode: true,
      status: 'pending'
    });
  expect(await provider.inviteSpaceUser(space.spaceID!, tester3.userID!, false, true))
    .toEqual({
      space,
      user: tester3,
      isOwner: false,
      isAdmin: false,
      isEgressNode: true,
      status: 'pending'
    });

  // get invitations created from within 
  // the respective user accounts

  await Auth.signIn('tester2', '@ppBr!cks2020');
  expect(await provider.getSpaceInvitations())
    .toEqual([{
      space: (({ lastSeen, ...s }) => s)(space2),
      isAdmin: true,
      isEgressNode: true,
    }]);

  await Auth.signIn('tester3', '@ppBr1cks2O20');
  expect(await provider.getUserSpaces())
    .toEqual([
      {
        isOwner: false,
        status: 'pending',
        space: space2
      }
    ]);
  expect(await provider.getSpaceInvitations())
    .toEqual([{
      space: (({ lastSeen, ...s }) => s)(space2),
      isAdmin: false,
      isEgressNode: true,
    }]);
  expect(await provider.acceptSpaceUserInvitation(space2.spaceID!))
    .toEqual({
      space,
      user: tester3
    });
  expect(await provider.getUserSpaces())
    .toEqual([
      {
        isOwner: false,
        status: 'active',
        space: space2
      }
    ]);
  expect(await provider.leaveSpaceUser(space2.spaceID!))
    .toEqual({
      space,
      user: tester3
    });
  expect(await provider.getUserSpaces())
    .toEqual([
      {
        isOwner: false,
        status: 'inactive',
        space: space2
      }
    ]);
});

it('deactivates a user associated with a space', async () => {
  await Auth.signIn('tester1', '@ppBr!cks2020');

  // trim space fields
  const space = (({ recipe, iaas, region, lastSeen, ...s }) => s)(space2);

  expect(await provider.deactivateSpaceUser(space.spaceID!, tester2.userID))
    .toEqual({
      space,
      user: tester2
    });
  
  await Auth.signIn('tester2', '@ppBr!cks2020');
  expect(await provider.getUserSpaces())
    .toEqual([
      {
        isOwner: false,
        status: 'inactive',
        space: space2
      }
    ]);
});

it('deletes a user associated with a space', async () => {
  await Auth.signIn('tester1', '@ppBr!cks2020');

  // trim space fields
  const space = (({ recipe, iaas, region, lastSeen, ...s }) => s)(space2);

  expect(await provider.deleteSpaceUser(space.spaceID!, tester2.userID))
    .toEqual({
      space,
      user: tester2
    });
  
  await Auth.signIn('tester2', '@ppBr!cks2020');
  expect(await provider.getUserSpaces())
    .toEqual([]);
});

it('deletes a user\'s space', async () => {
  await Auth.signIn('tester1', '@ppBr!cks2020');

  await provider.deleteSpace(space1.spaceID!);
  
  // expect only remaining space
  expect(await provider.getUserSpaces())
    .toEqual([
      {
        isOwner: true,
        status: 'active',
        space: space2
      }
    ]);
});

// create test data
beforeAll(async() => {

  try {
    await Auth.signIn('tester1', '@ppBr!cks2020');

    device1 = (({ certificateRequest, publicKey, ...d }) => d)(
      (<{data: AddDeviceMutation}> await API.graphql(
        graphqlOperation(addDevice, <AddDeviceMutationVariables>{
          deviceName: 'tester1\'s device #1',
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
    device2 = (({ certificateRequest, publicKey, ...d }) => d)(
      (<{data: AddDeviceMutation}> await API.graphql(
        graphqlOperation(addDevice, <AddDeviceMutationVariables>{
          deviceName: 'tester1\'s device #2',
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

    space1 =(<{data: AddSpaceMutation}> await API.graphql(
      graphqlOperation(addSpace, <AddSpaceMutationVariables>{
        spaceName: 'tester1\'s space #1',
        recipe: 'recipe #1',
        iaas: 'aws',
        region: 'us-east-1',
        isEgressNode: true
      }))).data.addSpace!.spaceUser!.space!;
    space2 = (<{data: AddSpaceMutation}> await API.graphql(
      graphqlOperation(addSpace, <AddSpaceMutationVariables>{
        spaceName: 'tester1\'s space #2',
        recipe: 'recipe #1',
        iaas: 'gcp',
        region: 'us-east1',
        isEgressNode: true
      }))).data.addSpace!.spaceUser!.space!;

    await Auth.signIn('tester2', '@ppBr!cks2020');
    await API.graphql(
      graphqlOperation(addDeviceUser, <AddDeviceUserMutationVariables>{
        deviceID: device1.deviceID,
        accessKey: { 
          wireguardPublicKey: 'wgtester200'
        }
      }))

    await Auth.signIn('tester3', '@ppBr1cks2O20');
    await API.graphql(
      graphqlOperation(addDeviceUser, <AddDeviceUserMutationVariables>{
        deviceID: device1.deviceID,
        accessKey: { 
          wireguardPublicKey: 'wgtester300'
        }
      }))

  } catch (error) {
    fail(error);
  }
});

afterAll(async () => {
  await Auth.signIn('tester1', '@ppBr!cks2020');
  try { await API.graphql(graphqlOperation(deleteDevice, { deviceID: device2.deviceID })); } catch (error) {}
  try { await API.graphql(graphqlOperation(deleteDevice, { deviceID: device1.deviceID })); } catch (error) {}
  try { await API.graphql(graphqlOperation(deleteSpace, { spaceID: space1.spaceID })); } catch (error) {}
  try { await API.graphql(graphqlOperation(deleteSpace, { spaceID: space2.spaceID })); } catch (error) {}
});

const trimSpaceProps = (space: Space) => <Space>{ spaceID: space.spaceID, spaceName: space.spaceName };
