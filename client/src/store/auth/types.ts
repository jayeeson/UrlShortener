export enum AuthActionTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CHECK_STATE = 'CHECK_STATE',
}

interface LoginAction {
  type: typeof AuthActionTypes.LOGIN;
  payload: LoggedInStatus;
}

interface LogoutAction {
  type: typeof AuthActionTypes.LOGOUT;
  payload: LoggedInStatus;
}

interface CheckStateAction {
  type: typeof AuthActionTypes.CHECK_STATE;
  payload: LoggedInStatus;
}

export type AuthAction = LoginAction | LogoutAction | CheckStateAction;

export interface AuthState {
  loginState: LoggedInStatus;
}

export enum LoggedInStatus {
  LoggedIn,
  GuestSession,
  NoToken,
  LoggedOutUnsureGuestTokenExists,
}
