import {createContext} from 'react';

export interface AuthContexDataObject {
  displayName?: string | any;
  email?: string | any;
  emailVerified?: boolean | any;
  isAnonymous?: boolean | any;
  metadata?: {creationTime?: number | any; lastSignInTime?: number | any};
  phoneNumber?: null | any;
  photoURL?: string | any;
  providerData?: [[Object]] | any;
  providerId?: string | any;
  tenantId?: null | any;
  uid?: string | any;
  accessToken?: string | any;
  accessTokenSource?: string | any;
  applicationID?: string | any;
  dataAccessExpirationTime?: number;
  declinedPermissions?: any[];
  expirationTime?: number;
  expiredPermissions?: any[];
  lastRefreshTime?: number;
  permissions?: string[];
  userID?: string;
}

export interface AuthContexDeviceArray {
  id: string;
  user: string;
  scene?: string;
}

export interface SchedulParams {
  id: string;
  output: string;
  time: string;
  duration: number;
  every: number;
  status: boolean;
}

export interface ActionsParams {
  if: string;
  output: string;
  value: number;
  con: string;
  state: boolean;
  status: boolean;
  id: string;
}

export interface AuthContextProps {
  SignIn: (data?: AuthContexDataObject | any) => void;
  SignOut: () => void;
  AddDevice: (data: AuthContexDeviceArray) => void;
  RemoveDevice: (id: String) => void;
  Schedule: (data: SchedulParams) => void;
  AddUser: (data: any) => void;
}

const AuthContextDefaultProps = {
  SignIn: () => {
    console.log('sign in');
  },
  SignOut: () => {
    console.log('sign out');
  },
  AddDevice: () => {},
  RemoveDevice: () => {},
  Schedule: () => {},
  AddUser: () => {},
};
const AuthContex = createContext<AuthContextProps>(AuthContextDefaultProps);

export default AuthContex;
