import {
  Logger,
  LOG_LEVEL_TRACE,
  setLogLevel,
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import {
  DeviceUser,
  UserAccessStatus
} from '../../../model/types';
import {
  DeviceUsersPayload,
  DeviceUpdateSubscriptionPayload,
  DevicePayload,
  DeviceUserPayload,
  DeviceTelemetrySubscriptionPayload,
  GET_USER_DEVICES,
  SUBSCRIBE_TO_DEVICE_UPDATES,
  DEVICE_UPDATE,
  SUBSCRIBE_TO_DEVICE_TELEMETRY,
  DEVICE_TELEMETRY
} from '../../actions';
import {
  UserSpaceState,
  initialUserSpaceState
} from '../../state';
import {
  DeviceUpdate,
  DeviceUserUpdate
} from '../../../model/types';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('get-user-devices.test');

// test reducer validates action flows
const actionTester = new ActionTester<UserSpaceState>(logger, initialUserSpaceState());
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

const _ = require('lodash');

it('dispatches an action to retrieve the logged in user tom\'s devices', async () => {

  mockProvider.setLoggedInUser('tom');
  const deviceUsers = <DeviceUser[]>mockProvider.user!.devices!.deviceUsers!
    .filter(deviceUser => deviceUser!.status == UserAccessStatus.active);

  const subDeviceIDs = deviceUsers.map(
    du => du.device!.deviceID
  ).sort();
  const subDeviceUserIDs = deviceUsers
    .filter(du => du.isOwner)
    .flatMap(
      du1 => du1.device!.users!.deviceUsers!.map(
        du2 => du1.device!.deviceID + '|' + du2!.user!.userID
      )
    )
    .concat(
      deviceUsers
        .filter(du => !du.isOwner)
        .map(du => du.device!.deviceID + '|' + du!.user!.userID)
    )
    .sort();

  const testSubDevice1 = deviceUsers[0].device!;
  const testSubDeviceUser1 = testSubDevice1.users!.deviceUsers![0]!;
  const testSubDevice2 = deviceUsers[1].device!;
  const testSubDeviceUser2 = testSubDevice2.users!.deviceUsers![1]!;

  // expected actions to get user devices and set up
  // subscribtions to device and device user updates
  actionTester.expectAction(GET_USER_DEVICES)
    .success<DeviceUsersPayload>(undefined,
      (counter, state, action) => {
        expect(action.payload!).toEqual({deviceUsers});
        return {
          ...state,
          deviceUpdatesActive: true,
          userDevices: _.cloneDeep(action.payload!.deviceUsers)
        };
      }
    );
  actionTester.expectAction<DeviceUpdateSubscriptionPayload>(
    SUBSCRIBE_TO_DEVICE_UPDATES, undefined,
    (counter, state, action) => {
      expect(
        action.payload!.subscribeDevices.sort().toString()
      ).toEqual(subDeviceIDs.toString());
      expect(action.payload!.unsubscribeDevices.toString()).toEqual('');
      return state;
    }
  )
    .success();
  actionTester.expectAction<DeviceTelemetrySubscriptionPayload>(
    SUBSCRIBE_TO_DEVICE_TELEMETRY, undefined,
    (counter, state, action) => {
      expect(
        action.payload!.subscribeDeviceUsers.map(
          ({deviceID, userID}) => deviceID + '|' + userID
        ).sort().toString()
      ).toEqual(subDeviceUserIDs.toString());
      expect(action.payload!.unsubscribeDeviceUsers.toString()).toEqual('');
      return state;
    }
  )
    .success();

  // expected updates subscribed to
  actionTester.expectAction<DevicePayload>(DEVICE_UPDATE, {
    device: {
      __typename: 'Device',
      publicKey: 'New public key #1'
    }
  });
  actionTester.expectAction<DevicePayload>(DEVICE_UPDATE, {
    device: {
      __typename: 'Device',
      publicKey: 'New public key #2',
    }
  });
  actionTester.expectAction<DeviceUserPayload>(DEVICE_TELEMETRY, {
    deviceUser: {
      __typename: 'DeviceUser',
      bytesDownloaded: '10',
      bytesUploaded: '20'
    }
  });
  actionTester.expectAction<DeviceUserPayload>(DEVICE_TELEMETRY, {
    deviceUser: {
      __typename: 'DeviceUser',
      bytesDownloaded: '22',
      bytesUploaded: '11',
    }
  });

  // refresh action expected as device update should
  // have detected a change to a device's user list
  actionTester.expectAction(GET_USER_DEVICES).success({ deviceUsers });
  actionTester.expectAction<DeviceTelemetrySubscriptionPayload>(
    SUBSCRIBE_TO_DEVICE_TELEMETRY, undefined,
    (counter, state, action) => {
      expect(action.payload?.subscribeDeviceUsers).toEqual([]);
      expect(action.payload?.unsubscribeDeviceUsers).toEqual([{
        'deviceID': testSubDevice2.deviceID,
        'userID': testSubDeviceUser2.user!.userID!
      }]);
      return state;
    }
  )
    .success();

  // initiate data retrieval
  dispatch.userspaceService!.getUserDevices();

  // push updates
  const pushDeviceUpdates = () => {
    try {
      mockProvider.pushSubscriptionUpdate(<DeviceUpdate>{
        deviceID: testSubDevice1.deviceID,
        numUsers: testSubDevice1.users!.deviceUsers!.length,
        device: {
          __typename: 'Device',
          publicKey: 'New public key #1'
        }
      }, testSubDevice1.deviceID!);
      mockProvider.pushSubscriptionUpdate(<DeviceUpdate>{
        deviceID: testSubDevice1.deviceID,
        numUsers: testSubDevice1.users!.deviceUsers!.length,
        device: {
          __typename: 'Device',
          publicKey: 'New public key #2'
        }
      }, testSubDevice1.deviceID!);

      mockProvider.deleteDeviceUser(testSubDevice2.deviceID!, testSubDeviceUser2.user!.userID!);
      mockProvider.pushSubscriptionUpdate(<DeviceUpdate>{
        deviceID: testSubDevice2.deviceID,
        numUsers: testSubDevice2.users!.deviceUsers!.length,        
      }, testSubDevice2.deviceID!);

    } catch (error: any) {
      console.log('waiting for subscription', error.message);
      setTimeout(pushDeviceUpdates, 500);
    }
  }
  setTimeout(pushDeviceUpdates, 500);

  const pushDeviceTelementry = () => {
    try {
      mockProvider.pushSubscriptionUpdate(<DeviceUserUpdate>{
        deviceID: testSubDeviceUser1.device!.deviceID,
        userID: testSubDeviceUser1.user!.userID,
        deviceUser: {
          __typename: 'DeviceUser',
          bytesDownloaded: '10',
          bytesUploaded: '20'
        }
      }, testSubDeviceUser1.device!.deviceID!, testSubDeviceUser1.user!.userID!);
      mockProvider.pushSubscriptionUpdate(<DeviceUserUpdate>{
        deviceID: testSubDeviceUser1.device!.deviceID,
        userID: testSubDeviceUser1.user!.userID,
        deviceUser: {
          __typename: 'DeviceUser',
          bytesDownloaded: '22',
          bytesUploaded: '11'
        }
      }, testSubDeviceUser1.device!.deviceID!, testSubDeviceUser1.user!.userID!);

    } catch (error: any) {
      console.log('waiting for subscription', error.message);
      setTimeout(pushDeviceTelementry, 500);
    }
  };
  setTimeout(pushDeviceTelementry, 500);

  await actionTester.done();
});
