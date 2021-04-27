import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  Device,
  UserAccessStatus
} from '../../../model/types';
import { 
  DevicesPayload,
  GET_USER_DEVICES 
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('get-user-devices.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('dispatches an action to retrieve the logged in user tom\'s devices', async () => {

  mockProvider.setLoggedInUser('tom');
  const devices = <Device[]>mockProvider.user!.devices!.deviceUsers!
    .filter(deviceUser => deviceUser!.status == UserAccessStatus.active)
    .map(deviceUsers => deviceUsers!.device);

  actionTester.expectAction(GET_USER_DEVICES)
    .success<DevicesPayload>({ devices });

  dispatch.userspaceService!.getUserDevices();
  await actionTester.done();
});

it('dispatches an action to retrieve the logged in user bob\'s devices', async () => {
  
  mockProvider.setLoggedInUser('bob');
  const devices = <Device[]>mockProvider.user!.devices!.deviceUsers!
    .filter(deviceUser => deviceUser!.status == UserAccessStatus.active)
    .map(deviceUsers => deviceUsers!.device);

  actionTester.expectAction(GET_USER_DEVICES)
    .success<DevicesPayload>({ devices });

  dispatch.userspaceService!.getUserDevices();
  await actionTester.done();
});
