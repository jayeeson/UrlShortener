import { ErrorsAction, ErrorsActionTypes } from './types';

export const setFailedAuthError = (message: string): ErrorsAction => {
  return {
    type: ErrorsActionTypes.FAILED_AUTH,
    payload: message,
  };
};

export const clearFailedAuthError = (): ErrorsAction => {
  return {
    type: ErrorsActionTypes.CLEAR_FAILED_AUTH,
  };
};

export const setServerError = (message: string): ErrorsAction => {
  return {
    type: ErrorsActionTypes.SERVER_ERROR,
    payload: message,
  };
};

export const clearServerError = (): ErrorsAction => {
  return {
    type: ErrorsActionTypes.CLEAR_SERVER_ERROR,
  };
};
