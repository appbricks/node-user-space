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
} from '../../action';

import { initServiceDispatch } from '../../__tests__/mock-provider';

// set log levels
if (process.env.DEBUG) {
  setLogLevel(LOG_LEVEL_TRACE);
}
const logger = new Logger('user-search.test');

// test reducer validates action flows
const actionTester = new ActionTester(logger);
// test service dispatcher
const { dispatch, mockProvider } = initServiceDispatch(actionTester);

it('searchs for a user', async () => {

  const userID = 'd12935f9-55b3-4514-8346-baaf99d6e6fa'; // bob's userID
  const userName = 'bob';

  mockProvider.setLoggedInUser('tom');
  actionTester.expectAction(USER_SEARCH, <UserSearchPayload>{ namePrefix: 'bo' })
    .success<UserSearchResultPayload>({ 
      userSearchResult: {
        __typename: "UserSearchConnection",
        totalCount: 1,
        users: [ {
          __typename: "UserSearchItem", 
          userID: userID, 
          userName: userName 
        } ]
      } 
    });

  dispatch.userspaceService!.userSearch('bo');
  await actionTester.done();
});
