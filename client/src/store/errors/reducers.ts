import { ErrorsAction, ErrorsActionTypes, ErrorsState, ServerError } from './types';

const noFailState: ServerError = { failed: false, message: '' };
const initialState: ErrorsState = {
  auth: noFailState,
  server: noFailState,
};

export default (state: ErrorsState = initialState, action: ErrorsAction): ErrorsState => {
  switch (action.type) {
    case ErrorsActionTypes.FAILED_AUTH:
      return { ...state, auth: { failed: true, message: action.payload } };
    case ErrorsActionTypes.CLEAR_FAILED_AUTH:
      return { ...state, auth: noFailState };
    case ErrorsActionTypes.SERVER_ERROR:
      return { ...state, server: { failed: true, message: action.payload } };
    case ErrorsActionTypes.CLEAR_SERVER_ERROR:
      return { ...state, server: noFailState };
    default:
      return state;
  }
};
