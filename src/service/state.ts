import { 
  State 
} from '@appbricks/utils';

import {
  UserRef,
  DeviceUser,
  SpaceUser,
  AppUser
} from '../model/types';

import {
  DeviceDetail,
  SpaceDetail,
  AppDetail
} from '../model/display';

// User Space state type
export interface UserSpaceState extends State {
  
  loggedInUserID?: string

  userSearchResult?: UserRef[]

  // indicates if device updates 
  // subscriptions are active
  deviceUpdatesActive: boolean
  // logged in users device list
  userDevices: DeviceUser[] 
  deviceAccessRequests: { [ deviceID: string ]: DeviceUser[] }
  // formated device info
  devices: { [deviceID: string]: DeviceDetail }

  // indicates if space updates 
  // subscriptions are active
  spaceUpdatesActive: boolean
  // logged in users space list
  userSpaces: SpaceUser[]
  spaceInvitations?: SpaceUser[]
  // formated space info
  spaces: { [spaceID: string]: SpaceDetail }

  // indicates if app updates 
  // subscriptions are active
  appUpdatesActive: boolean
  // logged in users space list
  userApps: AppUser[]
  // formated space info
  apps: { [appID: string]: AppDetail }
};

// User Space state properties
export interface UserSpaceStateProps {
  userspace?: UserSpaceState
};

export const initialUserSpaceState = (): UserSpaceState => 
  <UserSpaceState>{
    status: [],

    deviceUpdatesActive: false,
    userDevices: [],
    deviceAccessRequests: {},
    devices: {},

    spaceUpdatesActive: false,
    userSpaces: [],
    spaceInvitations: [],
    spaces: {},

    appUpdatesActive: false,
    userApps: [],
    apps: {},
  };
