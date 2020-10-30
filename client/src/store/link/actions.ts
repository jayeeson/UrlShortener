import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import loadBalancer from '../../apis/loadBalancer';
import { CreatedLink } from '../../types';
import { setServerError } from '../errors/actions';
import { LinkActionTypes, LinkState } from './types';

export const getLinks = () => async (
  dispatch: ThunkDispatch<LinkState, void, Action>
): Promise<void> => {
  try {
    const { data }: { data: CreatedLink[] } = await loadBalancer.get('/userlinks');

    dispatch({
      type: LinkActionTypes.GET_LINKS,
      payload: data,
    });
  } catch {
    dispatch(setServerError('Server error retrieving list of created links'));
  }
};

export const addLink = (longLink: string) => async (
  dispatch: ThunkDispatch<LinkState, void, Action<LinkActionTypes>>
): Promise<void> => {
  try {
    const { data }: { data: string } = await loadBalancer.post('/new', {
      url: longLink,
    });

    const newLink: CreatedLink = { short_link: data, long_link: longLink };

    dispatch({
      type: LinkActionTypes.ADD_LINK,
      payload: newLink,
    });
  } catch (err) {
    dispatch(setServerError('Server error: Could not create new shortlink'));
  }
};

export const deleteLink = (shortLink: string) => async (
  dispatch: ThunkDispatch<LinkState, void, Action>
): Promise<void> => {
  try {
    await loadBalancer.delete(`/link/${shortLink}`);

    dispatch({
      type: LinkActionTypes.DELETE_LINK,
      payload: shortLink,
    });
  } catch {
    setServerError('Server error deleting shortlink');
  }
};
