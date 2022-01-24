import { 
  State 
} from '@appbricks/utils';

import {
  UserRef,
  DeviceUser,
  SpaceUser,
} from '../model/types';

import {
  DeviceDetail,
  SpaceDetail
} from '../model/display';

// User Space state type
export interface UserSpaceState extends State {
  
  loggedInUserID?: string

  userSearchResult?: UserRef[]

  // logged in users device list
  userDevices: DeviceUser[] 
  deviceAccessRequests: { [ deviceID: string ]: DeviceUser[] }
  // formated device info
  devices: { [deviceID: string]: DeviceDetail }

  // logged in users space list
  userSpaces: SpaceUser[]
  spaceInvitations?: SpaceUser[]
  // formated space info
  spaces: { [spaceID: string]: SpaceDetail }
};

// User Space state properties
export interface UserSpaceStateProps {
  userspace?: UserSpaceState
};

export const initialUserSpaceState = (): UserSpaceState => 
  <UserSpaceState>{
    status: [],

    userDevices: [],
    deviceAccessRequests: {},
    devices: {},

    userSpaces: [],
    spaceInvitations: [],
    spaces: {},
  };
