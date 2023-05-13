export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_ERROR = 'SIGN_IN_ERROR';
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_ERROR = 'SIGN_UP_ERROR';
export const SIGN_OUT = 'SIGN_OUT';

export const signInRequest = ({
  email,
  password,
}) => ({
  type: SIGN_IN_REQUEST,
  payload: {
    email,
    password,
  },
});

export const signInSuccess = ({ ...user } = {}) => ({
  type: SIGN_IN_SUCCESS,
  payload: { user },
});

export const signInError = (error) => ({
  type: SIGN_IN_ERROR,
  payload: { error },
});

export const signUpRequest = ({ ...values }) => ({
  type: SIGN_UP_REQUEST,
  payload: { user: { ...values } },
});

export const signUpSuccess = () => ({ type: SIGN_UP_SUCCESS });

export const signUpError = (error) => ({
  type: SIGN_UP_ERROR,
  payload: { error },
});

export const signOut = () => ({ type: SIGN_OUT });
