export enum ErrorsActionTypes {
  FAILED_AUTH = 'FAILED_AUTH',
  CLEAR_FAILED_AUTH = 'CLEAR_FAILED_AUTH',
  SERVER_ERROR = 'SERVER_ERROR',
  CLEAR_SERVER_ERROR = 'CLEAR_SERVER_ERROR',
}

interface FailedAuthAction {
  type: typeof ErrorsActionTypes.FAILED_AUTH;
  payload: string;
}

interface ClearFailedAuthAction {
  type: typeof ErrorsActionTypes.CLEAR_FAILED_AUTH;
}

interface ServerErrorAction {
  type: typeof ErrorsActionTypes.SERVER_ERROR;
  payload: string;
}

interface ClearServerErrorAction {
  type: typeof ErrorsActionTypes.CLEAR_SERVER_ERROR;
}

export type ErrorsAction =
  | FailedAuthAction
  | ClearFailedAuthAction
  | ServerErrorAction
  | ClearServerErrorAction;

export interface ServerError {
  failed: boolean;
  message: string;
}

export interface ErrorsState {
  auth: ServerError;
  server: ServerError;
}
