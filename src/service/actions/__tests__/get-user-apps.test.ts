import {
  Logger,
  LOG_LEVEL_TRACE,
  setLogLevel,
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import {
  AppStatus,
  AppUser
} from '../../../model/types';
import {
  AppUsersPayload,
  AppUpdateSubscriptionPayload,
  AppPayload,
  AppUserPayload,
  AppTelemetrySubscriptionPayload,
  GET_USER_APPS,
  SUBSCRIBE_TO_APP_UPDATES,
  APP_UPDATE,
  SUBSCRIBE_TO_APP_TELEMETRY,
  APP_TELEMETRY
} from '../../actions';
import {
  UserSpaceState,
  initialUserSpaceState
} from '../../state';
import {
  AppUpdate,
  AppUserUpdate
} from '../../../model/types';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('get-user-apps.test');

// test reducer validates action flows
const actionTester = new ActionTester<UserSpaceState>(logger, initialUserSpaceState());
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

const _ = require('lodash');

it('dispatches an action to retrieve the logged in user toms apps', async () => {

  mockProvider.setLoggedInUser('tom');
  const appUsers = <AppUser[]>mockProvider.user!.apps!.appUsers!;

  const subAppIDs = appUsers.map(
    au => au.app!.appID
  ).sort();
  const subAppUserIDs = appUsers
    .filter(au => au.isOwner)
    .flatMap(
      du1 => du1.app!.users!.appUsers!.map(
        du2 => du1.app!.appID + '|' + du2!.user!.userID
      )
    )
    .concat(
      appUsers
        .filter(au => !au.isOwner)
        .map(au => au.app!.appID + '|' + au!.user!.userID)
    )
    .sort();

  const testSubApp1 = appUsers[0].app!;
  const testSubAppUser1 = testSubApp1.users!.appUsers![0]!;
  const testSubApp2 = appUsers[1].app!;
  const testSubAppUser2 = testSubApp2.users!.appUsers![1]!;

  // expected actions to get user apps and set up
  // subscribtions to app and app user updates
  actionTester.expectAction(GET_USER_APPS)
    .success<AppUsersPayload>(undefined,
      (counter, state, action) => {
        expect(action.payload!).toEqual({appUsers});
        return {
          ...state,
          appUpdatesActive: true,
          userApps: _.cloneDeep(action.payload!.appUsers)
        };
      }
    );
  actionTester.expectAction<AppUpdateSubscriptionPayload>(
    SUBSCRIBE_TO_APP_UPDATES, undefined,
    (counter, state, action) => {
      expect(
        action.payload!.subscribeApps.sort().toString()
      ).toEqual(subAppIDs.toString());
      expect(action.payload!.unsubscribeApps.toString()).toEqual('');
      return state;
    }
  )
    .success();
  actionTester.expectAction<AppTelemetrySubscriptionPayload>(
    SUBSCRIBE_TO_APP_TELEMETRY, undefined,
    (counter, state, action) => {
      expect(
        action.payload!.subscribeAppUsers.map(
          ({appID, userID}) => appID + '|' + userID
        ).sort().toString()
      ).toEqual(subAppUserIDs.toString());
      expect(action.payload!.unsubscribeAppUsers.toString()).toEqual('');
      return state;
    }
  )
    .success();

  // expected updates subscribed to
  actionTester.expectAction<AppPayload>(APP_UPDATE, {
    app: {
      __typename: 'App',
      status: AppStatus.running
    }
  });
  actionTester.expectAction<AppPayload>(APP_UPDATE, {
    app: {
      __typename: 'App',
      status: AppStatus.pending
    }
  });
  actionTester.expectAction<AppUserPayload>(APP_TELEMETRY, {
    appUser: {
      __typename: 'AppUser',
      lastAccessedTime: 1111
    }
  });
  actionTester.expectAction<AppUserPayload>(APP_TELEMETRY, {
    appUser: {
      __typename: 'AppUser',
      lastAccessedTime: 2222
    }
  });

  // refresh action expected as app update should
  // have detected a change to a app's user list
  actionTester.expectAction(GET_USER_APPS).success({ appUsers });
  actionTester.expectAction<AppTelemetrySubscriptionPayload>(
    SUBSCRIBE_TO_APP_TELEMETRY, undefined,
    (counter, state, action) => {
      expect(action.payload?.subscribeAppUsers).toEqual([]);
      expect(action.payload?.unsubscribeAppUsers).toEqual([{
        'appID': testSubApp2.appID,
        'userID': testSubAppUser2.user!.userID!
      }]);
      return state;
    }
  )
    .success();

  // initiate data retrieval
  dispatch.userspaceService!.getUserApps();

  // push updates
  const pushAppUpdates = () => {
    try {
      mockProvider.pushSubscriptionUpdate(<AppUpdate>{
        appID: testSubApp1.appID,
        numUsers: testSubApp1.users!.appUsers!.length,
        app: {
          __typename: 'App',
          status: AppStatus.running
        }
      }, testSubApp1.appID!);
      mockProvider.pushSubscriptionUpdate(<AppUpdate>{
        appID: testSubApp1.appID,
        numUsers: testSubApp1.users!.appUsers!.length,
        app: {
          __typename: 'App',
          status: AppStatus.pending
        }
      }, testSubApp1.appID!);

      mockProvider.deleteAppUser(testSubApp2.appID!, testSubAppUser2.user!.userID!);
      mockProvider.pushSubscriptionUpdate(<AppUpdate>{
        appID: testSubApp2.appID,
        numUsers: testSubApp2.users!.appUsers!.length,        
      }, testSubApp2.appID!);

    } catch (error: any) {
      console.log('waiting for subscription:', error.message);
      setTimeout(pushAppUpdates, 500);
    }
  }
  setTimeout(pushAppUpdates, 500);

  const pushAppTelementry = () => {
    try {
      mockProvider.pushSubscriptionUpdate(<AppUserUpdate>{
        appID: testSubAppUser1.app!.appID,
        userID: testSubAppUser1.user!.userID,
        appUser: {
          __typename: 'AppUser',
          lastAccessedTime: 1111
        }
      }, testSubAppUser1.app!.appID!, testSubAppUser1.user!.userID!);
      mockProvider.pushSubscriptionUpdate(<AppUserUpdate>{
        appID: testSubAppUser1.app!.appID,
        userID: testSubAppUser1.user!.userID,
        appUser: {
          __typename: 'AppUser',
          lastAccessedTime: 2222
        }
      }, testSubAppUser1.app!.appID!, testSubAppUser1.user!.userID!);

    } catch (error: any) {
      console.log('waiting for subscription:', error.message);
      setTimeout(pushAppTelementry, 500);
    }
  };
  setTimeout(pushAppTelementry, 500);

  await actionTester.done();
});
