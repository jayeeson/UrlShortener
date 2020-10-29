import { Dispatch } from 'react';
import loadBalancer from '../../apis/loadBalancer';
import history from '../../history';
import { AuthActionTypes, AuthAction, LoggedInStatus } from './types';
import { getLinks } from '../link/actions';

enum LoggedInResponses {
  LoggedIn = 'user token',
  GuestSession = 'guest token',
  NoToken = 'no token',
}

export const login = (username: string, password: string) => async (
  dispatch: Dispatch<AuthAction | ReturnType<typeof getLinks>>
): Promise<void> => {
  const response = await loadBalancer.post('/login', {
    username,
    password,
  });

  if (response.data === `Now logged in as ${username}`) {
    ///\todo: update links

    dispatch({
      type: AuthActionTypes.LOGIN,
      payload: LoggedInStatus.LoggedIn,
    });

    dispatch(getLinks());
    history.push('/');
  }
};

export const logout = () => async (
  dispatch: Dispatch<AuthAction | ReturnType<typeof getLinks>>
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
  dispatch: Dispatch<AuthAction | ReturnType<typeof getLinks>>
): Promise<void> => {
  const { data } = await loadBalancer.get('/jwt/status');
  console.log('status:', data);

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
