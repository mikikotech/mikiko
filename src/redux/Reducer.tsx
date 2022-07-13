import {AuthContexDataObject, SchedulParams} from '../route/AuthContext';
import {Action} from './Action';
import {ActionType} from './ActionTypes';

interface ReducerProps {
  auth: AuthContexDataObject;
  device: Array<any>;
  schedule: Array<any>;
  homeInfo: any;
}

const initialState = {
  auth: {},
  device: [],
  schedule: [],
  homeInfo: {},
};

const reducer = (state: ReducerProps = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.LOGIN:
      return {
        ...state,
        auth: action.payload,
      };
    case ActionType.LOGOUT:
      return {
        ...state,
        auth: {},
      };
    case ActionType.RETRIVE:
      return {
        ...state,
        device: action.payload,
      };
    case ActionType.ADD_DEVICE:
      return {
        ...state,
        device: action.payload,
      };
    case ActionType.REMOVE_DEVICE:
      return {
        ...state,
        device: action.payload,
      };
    case ActionType.SCHEDULE:
      return {
        ...state,
        schedule: action.payload,
      };
    case ActionType.ADD_USER:
      return {
        ...state,
        homeInfo: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

export type ReducerRootState = ReturnType<typeof reducer>;

export default reducer;
