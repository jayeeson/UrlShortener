import { combineReducers } from 'redux';
import authReducer from './auth/reducers';
import linkReducer from './link/reducers';

const combinedReducers = combineReducers({
  auth: authReducer,
  links: linkReducer,
});

export default combinedReducers;

export type RootState = ReturnType<typeof combinedReducers>;
