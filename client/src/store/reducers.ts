import { combineReducers } from 'redux';
import authReducer from './auth/reducers';
import linkReducer from './link/reducers';
import errorsReducer from './errors/reducers';

const combinedReducers = combineReducers({
  auth: authReducer,
  links: linkReducer,
  errors: errorsReducer,
});

export default combinedReducers;

export type RootState = ReturnType<typeof combinedReducers>;
