export enum AuthActionTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CHECK_STATE = 'CHECK_STATE',
  FAILED_AUTH = 'FAILED_AUTH',
  CLEAR_FAILED_AUTH = 'CLEAR_FAILED_AUTH',
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

interface FailedAuthAction {
  type: typeof AuthActionTypes.FAILED_AUTH;
  payload: AuthFailure;
}

interface ClearFailedAuthAction {
  type: typeof AuthActionTypes.CLEAR_FAILED_AUTH;
  payload: AuthFailure;
}

export type AuthAction =
  | LoginAction
  | LogoutAction
  | CheckStateAction
  | FailedAuthAction
  | ClearFailedAuthAction;

export interface AuthState {
  loginState: LoggedInStatus;
  authFailure: AuthFailure;
}

export enum LoggedInStatus {
  LoggedIn,
  GuestSession,
  NoToken,
  LoggedOutUnsureGuestTokenExists,
}

export interface AuthFailure {
  failed: boolean;
  message: string;
}
