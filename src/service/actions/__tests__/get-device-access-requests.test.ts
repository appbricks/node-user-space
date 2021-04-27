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
  DeviceUserIDPayload,
  DeviceUsersPayload,
  GET_DEVICE_ACCESS_REQUESTS 
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('get-device-access-requests.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('dispatches an action with an invalid device ID', async () => {

  const deviceID = 'f25b8176-dbb7-4a8a-b08d-5f8e56cc4303';
  mockProvider.setLoggedInUser('tom');

  actionTester.expectAction<DeviceUserIDPayload>(GET_DEVICE_ACCESS_REQUESTS, { deviceID })
    .error(`user does not own a device with ID ${deviceID}`);

  dispatch.userspaceService!.getDeviceAccessRequests(deviceID);
  await actionTester.done();
})

it('dispatches an action to retrieve device access requests for logged in user tom\'s device #1', async () => {

  const deviceID = 'ed3e2219-ff72-4405-88fb-8dab24030770';

  mockProvider.setLoggedInUser('tom');
  const deviceUsers = <DeviceUser[]>mockProvider.user!.devices!.deviceUsers!
    .filter(deviceUser => deviceUser!.isOwner)
    .map(deviceUser => deviceUser!.device)
    .reduce( 
      (accessRequests, device) => accessRequests.concat(
        device!.users!.deviceUsers!.filter(
          deviceUser => 
            deviceUser!.status == UserAccessStatus.pending &&
            deviceUser!.device!.deviceID == deviceID
        )
      ),
      <(DeviceUser | null)[]>[]
    );

  actionTester.expectAction<DeviceUserIDPayload>(GET_DEVICE_ACCESS_REQUESTS, { deviceID })
    .success<DeviceUsersPayload>({ deviceUsers });

  dispatch.userspaceService!.getDeviceAccessRequests(deviceID);
  await actionTester.done();
});

it('dispatches an action to retrieve device access requests for logged in user tom\'s device #1', async () => {

  const deviceID = 'f25b8176-dbb7-4a8a-b08d-5f8e56cc4303';

  mockProvider.setLoggedInUser('bob');
  const deviceUsers = <DeviceUser[]>mockProvider.user!.devices!.deviceUsers!
    .filter(deviceUser => deviceUser!.isOwner)
    .map(deviceUser => deviceUser!.device)
    .reduce( 
      (accessRequests, device) => accessRequests.concat(
        device!.users!.deviceUsers!.filter(
          deviceUser => 
            deviceUser!.status == UserAccessStatus.pending &&
            deviceUser!.device!.deviceID == deviceID
        )
      ),
      <(DeviceUser | null)[]>[]
    );

  actionTester.expectAction<DeviceUserIDPayload>(GET_DEVICE_ACCESS_REQUESTS, { deviceID })
    .success<DeviceUsersPayload>({ deviceUsers });

  dispatch.userspaceService!.getDeviceAccessRequests(deviceID);
  await actionTester.done();
});
