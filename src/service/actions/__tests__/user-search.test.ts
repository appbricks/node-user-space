import { 
  Logger, 
  LOG_LEVEL_TRACE, 
  setLogLevel, 
} from '@appbricks/utils';
import { ActionTester } from '@appbricks/test-utils';

import { 
  UserSearchItem,
  Cursor
} from '../../../model/types';

import { 
  UserSearchPayload,
  UserSearchResultPayload,
  USER_SEARCH,
  USER_SEARCH_PAGE_PREV,
  USER_SEARCH_PAGE_NEXT,
  CLEAR_USER_SEARCH_RESULTS
} from '../../action';
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
      userSearchResult: {
        __typename: "UserSearchConnection",
        totalCount: 1,
        users: [ {
          __typename: "UserSearchItem", 
          userID: userID, 
          userName: userName 
        } ],
        pageInfo: {
          __typename: 'PageInfo',
          hasPreviousePage: false,
          hasNextPage: false,
          cursor: {
            __typename: 'Cursor',
            index: -1,
            nextTokens: []
          }
        }
      } 
    });

  dispatch.userspaceService!.userSearch('bo');
  await actionTester.done();
});

it('searches users matching a prefix with pagination and handles errors', async () => {

  let pageCursor: Cursor = {
    __typename: 'Cursor'
  };

  const saveState = (
    searchArgs: UserSearchPayload, 
    searchResult: UserSearchResultPayload, 
    state: UserSpaceState
  ): UserSpaceState => {

    const pageInfo = searchResult.userSearchResult.pageInfo!;
    pageCursor = pageInfo.cursor!;

    return {
      ...state,
      userSearchResult: {
        result: <UserSearchItem[]>searchResult.userSearchResult.users,
        searchPrefix: searchArgs.namePrefix,
        limit: searchArgs.limit!,
        pageInfo
      },
    };
  };

  mockProvider.setLoggedInUser('tom');

  actionTester.expectAction(USER_SEARCH_PAGE_PREV)
    .error('No search results to traverse.');
  dispatch.userspaceService!.userSearchPagePrev();
  await actionTester.done();

  actionTester.expectAction(USER_SEARCH_PAGE_NEXT)
    .error('No search results to traverse.');
  dispatch.userspaceService!.userSearchPageNext();
    await actionTester.done();

  actionTester.expectAction(USER_SEARCH, <UserSearchPayload>{ namePrefix: 'd', limit: 2 })
    .success<UserSearchResultPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.userSearchResult.totalCount).toEqual(2);
      expect(action.payload!.userSearchResult.pageInfo!.hasPreviousePage).toBeFalsy();
      expect(action.payload!.userSearchResult.pageInfo!.hasNextPage).toBeTruthy();
      expect(action.payload!.userSearchResult.users).toEqual([
        {
          __typename: 'UserSearchItem',
          userID: '95e579be-a365-4268-bed0-17df80ef3dce',
          userName: 'deb'
        },
        {
          __typename: 'UserSearchItem',
          userID: 'c18d325c-c0f1-4ba3-8898-026b48eb9bdc',
          userName: 'debbie'
        }
      ]);
      return saveState(<UserSearchPayload>action.meta.relatedAction!.payload!, action.payload!, state);
    });

  dispatch.userspaceService!.userSearch('d', 2);
  await actionTester.done();

  actionTester.expectAction(USER_SEARCH_PAGE_PREV)
    .error('No previous page available in search results.');
  dispatch.userspaceService!.userSearchPagePrev();
  await actionTester.done();

  actionTester.expectAction(USER_SEARCH_PAGE_NEXT);
  actionTester.expectAction(USER_SEARCH, 
    <UserSearchPayload>{ 
      namePrefix: 'd', 
      limit: 2,
      cursor: {
        index: pageCursor.index,
        nextTokens: pageCursor.nextTokens
      }
    })
    .success<UserSearchResultPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.userSearchResult.totalCount).toEqual(2);
      expect(action.payload!.userSearchResult.pageInfo!.hasPreviousePage).toBeTruthy();
      expect(action.payload!.userSearchResult.pageInfo!.hasNextPage).toBeTruthy();
      expect(action.payload!.userSearchResult.users).toEqual([
        {
          __typename: 'UserSearchItem',
          userID: 'e745d48e-d9ba-4277-9d9e-fc13197eff38',
          userName: 'denny'
        },
        {
          __typename: 'UserSearchItem',
          userID: '1ade82fc-750e-433c-aa30-4c5764ff02fb',
          userName: 'darren'
        }
      ]);
      return saveState(<UserSearchPayload>action.meta.relatedAction!.payload!, action.payload!, state);
    });

  dispatch.userspaceService!.userSearchPageNext();
  await actionTester.done();

  actionTester.expectAction(USER_SEARCH_PAGE_NEXT);
  actionTester.expectAction(USER_SEARCH, 
    <UserSearchPayload>{ 
      namePrefix: 'd', 
      limit: 2,
      cursor: {
        index: pageCursor.index,
        nextTokens: pageCursor.nextTokens
      }
    })
    .success<UserSearchResultPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.userSearchResult.totalCount).toEqual(1);
      expect(action.payload!.userSearchResult.pageInfo!.hasPreviousePage).toBeTruthy();
      expect(action.payload!.userSearchResult.pageInfo!.hasNextPage).toBeFalsy();
      expect(action.payload!.userSearchResult.users).toEqual([
        {
          __typename: 'UserSearchItem',
          userID: '8e0a1535-bf9e-4548-8602-ce3b0f619734',
          userName: 'danny'
        }
      ]);
      return saveState(<UserSearchPayload>action.meta.relatedAction!.payload!, action.payload!, state);
    });

  dispatch.userspaceService!.userSearchPageNext();
  await actionTester.done();

  actionTester.expectAction(USER_SEARCH_PAGE_NEXT)
    .error('No next page available in search results.');
  dispatch.userspaceService!.userSearchPageNext();
  await actionTester.done();

  actionTester.expectAction(USER_SEARCH_PAGE_PREV);
  actionTester.expectAction(USER_SEARCH, 
    <UserSearchPayload>{ 
      namePrefix: 'd', 
      limit: 2,
      cursor: {
        index: pageCursor.index! - 2,
        nextTokens: pageCursor.nextTokens
      }
    })
    .success<UserSearchResultPayload>(undefined, (counter, state, action) => {
      expect(action.payload!.userSearchResult.totalCount).toEqual(2);
      expect(action.payload!.userSearchResult.pageInfo!.hasPreviousePage).toBeTruthy();
      expect(action.payload!.userSearchResult.pageInfo!.hasNextPage).toBeTruthy();
      expect(action.payload!.userSearchResult.users).toEqual([
        {
          __typename: 'UserSearchItem',
          userID: 'e745d48e-d9ba-4277-9d9e-fc13197eff38',
          userName: 'denny'
        },
        {
          __typename: 'UserSearchItem',
          userID: '1ade82fc-750e-433c-aa30-4c5764ff02fb',
          userName: 'darren'
        }
      ]);
      return saveState(<UserSearchPayload>action.meta.relatedAction!.payload!, action.payload!, state);
    });

  dispatch.userspaceService!.userSearchPagePrev();
  await actionTester.done();

  actionTester.expectAction(CLEAR_USER_SEARCH_RESULTS);
  dispatch.userspaceService!.clearUserSearchResults();
  await actionTester.done();
});