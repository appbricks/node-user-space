import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  UserSearchPayload,
  UserSearchResultPayload,
  USER_SEARCH,
  CLEAR_USER_SEARCH_RESULTS
} from '../../actions';
import {
  UserSpaceState
} from '../../state';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('user-search.test');

// test reducer validates action flows
const actionTester = new ActionTester<UserSpaceState>(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('searches users matching a prefix', async () => {

  const userID = 'd12935f9-55b3-4514-8346-baaf99d6e6fa'; // bob's userID
  const userName = 'bob';

  mockProvider.setLoggedInUser('tom');
  actionTester.expectAction(USER_SEARCH, <UserSearchPayload>{ namePrefix: 'bo' })
    .success<UserSearchResultPayload>({ 
      userSearchResult: [ {
        __typename: "UserRef", 
        userID: userID, 
        userName: userName,
        firstName: 'Bobby',
        middleName: 'J',
        familyName: 'Brown',
      } ]
    });

  dispatch.userspaceService!.userSearch('bo');
  await actionTester.done();

  actionTester.expectAction(CLEAR_USER_SEARCH_RESULTS);
  dispatch.userspaceService!.clearUserSearchResults();
  await actionTester.done();
});
