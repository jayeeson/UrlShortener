import _ from 'lodash';
import { LinkActionTypes, LinkAction, LinkState } from './types';

export default (state: LinkState = {}, action: LinkAction): LinkState => {
  switch (action.type) {
    case LinkActionTypes.GET_LINKS:
      return { ..._.mapKeys(action.payload, 'short_link') };
    case LinkActionTypes.ADD_LINK:
      return { ...state, [action.payload.short_link]: action.payload };
    case LinkActionTypes.DELETE_LINK:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
