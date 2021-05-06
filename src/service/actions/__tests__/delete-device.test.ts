import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  DeviceIDPayload,
  DeviceUsersPayload,
  DELETE_DEVICE,
  GET_USER_DEVICES
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('delete-device.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('deletes a device', async () => {

  const deviceID = '9bb6399-6c7a-4cd5-a536-5a4d74482020'; // bob's device #2

  mockProvider.setLoggedInUser('bob');  
  expect(mockProvider.user!.devices!.deviceUsers!
    .find(deviceUser => deviceUser!.device!.deviceID == deviceID)
  ).toBeDefined();

  actionTester.expectAction(DELETE_DEVICE, <DeviceIDPayload>{ deviceID })
    .success();
  actionTester.expectAction(GET_USER_DEVICES)
    .success<DeviceUsersPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.deviceUsers).toBeDefined();
      return state;
    });

  dispatch.userspaceService!.deleteDevice(deviceID);
  await actionTester.done();

  expect(actionTester.actionCounter).toEqual(2);
  expect(mockProvider.user!.devices!.deviceUsers!
    .find(deviceUser => deviceUser!.device!.deviceID == deviceID)
  ).toBeUndefined();
});
