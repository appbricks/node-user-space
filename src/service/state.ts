import { State, ActionResult } from '@appbricks/utils';

// User Space state type
export interface UserSpaceState extends State {

};

// User Space state properties
export interface UserSpaceStateProps {
  userspace?: UserSpaceState
};

export const initialUserSpaceState = (): UserSpaceState => 
  <UserSpaceState>{
  };
