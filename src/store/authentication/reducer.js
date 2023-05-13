import { initialState } from './selectors';
import {
  SIGN_IN_SUCCESS,
  SIGN_IN_ERROR,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_ERROR,
  SIGN_OUT,
} from './actions';

export default (state = initialState, {
  type,
  payload,
}) => {
  switch (type) {
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        user: payload.user,
        authenticated: true,
        signInError: initialState.signInError,
      };
    case SIGN_IN_ERROR:
      return {
        ...state,
        authenticated: false,
        signInError: payload.error,
      };
    case SIGN_UP_REQUEST:
      return {
        ...state,
        signUpError: initialState.signUpError,
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        authenticated: true,
        signUpError: initialState.signUpError,
      };
    case SIGN_UP_ERROR:
      return {
        ...state,
        authenticated: false,
        signUpError: payload.error,
      };
    case SIGN_OUT:
      return {
        ...state,
        authenticated: false,
      };
    default:
      return state;
  }
};
