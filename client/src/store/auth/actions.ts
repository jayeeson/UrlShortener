import loadBalancer from '../../apis/loadBalancer';
import history from '../../history';
import { AuthActionTypes, LoggedInStatus, AuthState } from './types';
import { getLinks } from '../link/actions';
import { setFailedAuthError } from '../errors/actions';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

enum LoggedInResponses {
  LoggedIn = 'user token',
  GuestSession = 'guest token',
  NoToken = 'no token',
}

enum RegisterResponses {
  Success = 'User created.',
  UsernameAlreadyTaken = 'That username is already taken. Please choose another.',
  UnknownFailure = 'Could not create user',
}

export const login = (username: string, password: string) => async (
  // dispatch: Dispatch<AuthAction | ReturnType<typeof getLinks>>
  dispatch: ThunkDispatch<AuthState, void, Action>
): Promise<void> => {
  const response = await loadBalancer.post('/login', {
    username,
    password,
  });

  if (response.data === `Now logged in as ${username}`) {
    dispatch({
      type: AuthActionTypes.LOGIN,
      payload: LoggedInStatus.LoggedIn,
    });

    dispatch(getLinks());
    history.push('/');
  } else {
    dispatch(setFailedAuthError('Login failed: incorrect username / password'));
  }
};

export const logout = () => async (
  dispatch: ThunkDispatch<AuthState, void, Action>
): Promise<void> => {
  const response = await loadBalancer.get('/logout');
  console.log(response.data);

  if (response.data === 'Logged out') {
    const { data } = await loadBalancer.get('/jwt/status');
    if (data === LoggedInResponses.NoToken) {
      await loadBalancer.get('/jwt/guest');
    }

    dispatch({
      type: AuthActionTypes.LOGOUT,
      payload: LoggedInStatus.GuestSession,
    });

    dispatch(getLinks());
  }
};

export const checkState = () => async (
  dispatch: ThunkDispatch<AuthState, void, Action>
): Promise<void> => {
  const { data } = await loadBalancer.get('/jwt/status');

  let payload: LoggedInStatus;
  if (data === LoggedInResponses.GuestSession) {
    payload = LoggedInStatus.GuestSession;
  } else if (data === LoggedInResponses.LoggedIn) {
    payload = LoggedInStatus.LoggedIn;
  } else {
    try {
      await loadBalancer.get('/jwt/guest');
      payload = LoggedInStatus.GuestSession;
    } catch {
      payload = LoggedInStatus.NoToken;
    }
  }

  dispatch({
    type: AuthActionTypes.CHECK_STATE,
    payload,
  });

  dispatch(getLinks());
};

export const register = (username: string, password: string) => async (
  dispatch: ThunkDispatch<AuthState, void, Action>
): Promise<void> => {
  const { data } = await loadBalancer.post('/register', { username, password });

  if (data === RegisterResponses.Success) {
    dispatch(login(username, password));
  } else if (data === RegisterResponses.UsernameAlreadyTaken) {
    dispatch(setFailedAuthError('That username already exists. Please register another username.'));
  } else if (data === RegisterResponses.UnknownFailure) {
    dispatch(setFailedAuthError('Registration failed for unknown reason'));
  }
};
