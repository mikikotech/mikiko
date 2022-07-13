import {
  AuthContexDataObject,
  AuthContexDeviceArray,
  SchedulParams,
} from '../route/AuthContext';
import {ActionType} from './ActionTypes';

interface LoginAction {
  type: ActionType.LOGIN;
  payload: AuthContexDataObject;
}

interface LogoutAction {
  type: ActionType.LOGOUT;
}

interface RetriveAction {
  type: ActionType.RETRIVE;
  payload: Array<AuthContexDeviceArray>;
}

interface AddDeviceAction {
  type: ActionType.ADD_DEVICE;
  payload: Array<AuthContexDeviceArray>;
}

interface RemoveDeviceAction {
  type: ActionType.REMOVE_DEVICE;
  payload: Array<AuthContexDeviceArray>;
}

interface ScheduleAction {
  type: ActionType.SCHEDULE;
  payload: Array<SchedulParams>;
}

interface UserAction {
  type: ActionType.ADD_USER;
  payload: any;
}

export type Action =
  | LoginAction
  | LogoutAction
  | RetriveAction
  | RemoveDeviceAction
  | ScheduleAction
  | UserAction
  | AddDeviceAction;
