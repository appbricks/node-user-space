import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  DeviceIDPayload,
  DevicePayload,
  DELETE_DEVICE 
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
  const device = mockProvider.user!.devices!.deviceUsers!
    .find(deviceUser => deviceUser!.device!.deviceID == deviceID)!.device!;

  actionTester.expectAction(DELETE_DEVICE, <DeviceIDPayload>{ deviceID })
    .success<DevicePayload>({ device });

  dispatch.userspaceService!.deleteDevice(deviceID);
  await actionTester.done();
});
