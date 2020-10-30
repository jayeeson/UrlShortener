import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ErrorsAction, ErrorsActionTypes, ErrorsState } from './types';

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

export const setServerError = (message: string) => async (
  dispatch: ThunkDispatch<ErrorsState, void, Action>
): Promise<void> => {
  setTimeout(() => {
    dispatch(clearServerError());
  }, 10000);

  dispatch({
    type: ErrorsActionTypes.SERVER_ERROR,
    payload: message,
  });
};

export const clearServerError = (): ErrorsAction => {
  return {
    type: ErrorsActionTypes.CLEAR_SERVER_ERROR,
  };
};
