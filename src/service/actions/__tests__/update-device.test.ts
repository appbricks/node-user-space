import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import {
  Device
} from '../../../model/types';
import { 
  UPDATE_DEVICE, 
  DeviceUpdatePayload,
  DevicePayload
} from '../../actions';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('update-device.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('dispatches an action to update a user\'s device', async () => {

  mockProvider.setLoggedInUser('tom');
  const device = mockProvider.user!.devices!.deviceUsers![0]!.device!;

  actionTester.expectAction<DeviceUpdatePayload>(UPDATE_DEVICE, {
    deviceID: device.deviceID!, 
    deviceKey: {
      publicKey: 'tom\'s device #1 public key updated',
      certificateRequest: 'tom\'s device #1 certificate key updated'
    },
    clientVersion: 'app/darwin:arm64/1.5.1',
    settings: {
      someSetting: 'someValue'
    }
  })
    .success<DevicePayload>({ device });

  dispatch.userspaceService!.updateDevice(
    device.deviceID!, 
    {
      publicKey: 'tom\'s device #1 public key updated',
      certificateRequest: 'tom\'s device #1 certificate key updated'
    },
    'app/darwin:arm64/1.5.1',
    {
      someSetting: 'someValue'
    }
  );
  await actionTester.done();

  expect(device).toMatchObject(<Device>{
    ...device,
    publicKey: 'tom\'s device #1 public key updated',
    clientVersion: 'app/darwin:arm64/1.5.1',
    settings: '{"someSetting":"someValue"}'
  });
});
