import { LoggedInStatus } from './types';
import { AuthAction, AuthActionTypes, AuthState } from './types';

export default (
  state: AuthState = { loginState: LoggedInStatus.NoToken },
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
    case AuthActionTypes.LOGOUT:
    case AuthActionTypes.CHECK_STATE:
      return { loginState: action.payload };
    default:
      return state;
  }
};
