import { State, ActionResult } from '@appbricks/utils';

import {
  UserSearchItem,
  Device,
  DeviceUser,
  Space,
  SpaceUser,
  PageInfo
} from '../model/types';

// User Space state type
export interface UserSpaceState extends State {
  
  userSearchResult?: {
    result: UserSearchItem[]
    
    // used for pagination
    searchPrefix: string
    limit: number
    pageInfo: PageInfo
  }

  // logged in users device list
  userDevices?: DeviceUser[] 
  deviceAccessRequests?: { [ deviceID: string ]: DeviceUser[] }

  userSpaces?: SpaceUser[]
  spaceInvitations?: SpaceUser[]
};

// User Space state properties
export interface UserSpaceStateProps {
  userspace?: UserSpaceState
};

export const initialUserSpaceState = (): UserSpaceState => 
  <UserSpaceState>{
    status: []
  };
