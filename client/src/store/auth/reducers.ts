import { LoggedInStatus } from './types';
import { AuthAction, AuthActionTypes, AuthState } from './types';

export default (
  state: AuthState = {
    loginState: LoggedInStatus.NoToken,
  },
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, loginState: action.payload };
    case AuthActionTypes.LOGOUT:
      return { ...state, loginState: action.payload };
    case AuthActionTypes.CHECK_STATE:
      return { ...state, loginState: action.payload };
    default:
      return state;
  }
};
