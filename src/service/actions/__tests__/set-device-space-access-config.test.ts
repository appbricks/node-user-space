import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  DeviceSpaceAccessConfigPayload,
  SET_DEVICE_SPACE_ACCESS_CONFIG
} from '../../actions';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('set-device-space-access-config.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('sets a devices space access config', async () => {

  const deviceID = '9bb6399-6c7a-4cd5-a536-5a4d74482020'; // bob's device #2
  const spaceID = 'd83b7d95-5681-427d-a65a-5d8a868d72e9'; // tom's space #1

  mockProvider.setLoggedInUser('bob');  
  expect(mockProvider.spaceAccessConfigViewedFlag).toBeFalsy();

  expect(mockProvider.user!.devices!.deviceUsers!
    .find(deviceUser => deviceUser!.device!.deviceID == deviceID)
  ).toBeDefined();

  actionTester.expectAction(SET_DEVICE_SPACE_ACCESS_CONFIG, <DeviceSpaceAccessConfigPayload>{ deviceID, spaceID, viewed: true })
    .success();  

  dispatch.userspaceService!.setDeviceSpaceAccessConfig(deviceID, spaceID, true);
  await actionTester.done();

  expect(actionTester.actionCounter).toEqual(1);
  expect(mockProvider.spaceAccessConfigViewedFlag).toBeTruthy();
});
