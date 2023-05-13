import {
  call, put, fork, take,
} from 'redux-saga/effects';

import {
  signInSuccess,
  signInError,
  SIGN_IN_REQUEST,
  signUpError,
  SIGN_UP_REQUEST,
  SIGN_OUT,
} from './actions';

export function* handleSignIn(params) {
  const {
    api,
  } = global;
  try {
    const response = yield call(
      [
        api,
        api.post,
      ],
      '/login',
      { ...params },
    );
    yield call(
      [
        localStorage,
        localStorage.setItem,
      ], 'access_token', response.data.token,
    );
    yield call(
      [
        api,
        api.setToken,
      ], response.data.token,
    );
    yield call(
      [
        api,
        api.setToken,
      ], response.data.token,
    );
    yield put(signInSuccess(response.data));
  } catch (e) {
    yield put(signInError(e));
  }
}

export function* handleSignOut() {
  const {
    api,
    api,
  } = global;
  yield call(
    [
      localStorage,
      localStorage.setItem,
    ], 'access_token', '',
  );
  yield call([
    api,
    api.unsetToken,
  ]);
  yield call([
    api,
    api.unsetToken,
  ]);
}

export function* watchSignInRequest() {
  while (true) {
    const { payload } = yield take(SIGN_IN_REQUEST);
    yield call(
      handleSignIn, payload,
    );
  }
}

export function* handleSignUp(params) {
  const {
    api,
    api,
  } = global;
  try {
    const response = yield call(
      [
        api,
        api.post,
      ], '/register', params,
    );
    yield put(signInSuccess(response.data));
    yield call(
      [
        localStorage,
        localStorage.setItem,
      ], 'access_token', response.data.token,
    );
    yield call(
      [
        api,
        api.setToken,
      ], response.data.token,
    );
    yield call(
      [
        api,
        api.setToken,
      ], response.data.token,
    );
  } catch (e) {
    yield put(signUpError(e));
  }
}

export function* watchSignUpRequest() {
  while (true) {
    const { payload } = yield take(SIGN_UP_REQUEST);
    yield call(
      handleSignUp, payload,
    );
  }
}
export function* watchSignOutRequest() {
  while (true) {
    yield take(SIGN_OUT);
    yield call(handleSignOut);
  }
}

export default function* authenticationSaga() {
  yield fork(watchSignInRequest);
  yield fork(watchSignUpRequest);
  yield fork(watchSignOutRequest);
}
