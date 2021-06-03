import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { DeviceUser } from '../../../model/types';
import { 
  DeviceUserIDPayload,
  DeviceUserPayload,
  DeviceUsersPayload,  
  DELETE_USER_FROM_DEVICE,
  GET_USER_DEVICES,
  GET_DEVICE_ACCESS_REQUESTS
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('delete-user-from-device.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('deletes a user from a device', async () => {

  const deviceID = '9bb6399-6c7a-4cd5-a536-5a4d74482020'; // bob's device #2
  const userID = 'a645c56e-f454-460f-8324-eff15357e973'; // tom

  mockProvider.setLoggedInUser('bob');
  const deviceUser = <DeviceUser>mockProvider.user!.devices!.deviceUsers!
    .find(deviceUser => deviceUser!.device!.deviceID == deviceID)!
      .device!.users!.deviceUsers!
        .find(deviceUser => deviceUser!.user!.userID == userID);

  actionTester.expectAction(DELETE_USER_FROM_DEVICE, <DeviceUserIDPayload>{ deviceID, userID })
    .success<DeviceUserPayload>({ deviceUser });
  actionTester.expectAction(GET_USER_DEVICES)
    .success<DeviceUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.deviceUsers).toBeDefined();
      return state;
    });
    
  dispatch.userspaceService!.deleteUserFromDevice(deviceID, userID);
  await actionTester.done();

  expect(actionTester.actionCounter).toEqual(2);
});
