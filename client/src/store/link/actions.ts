import { Dispatch } from 'react';
import loadBalancer from '../../apis/loadBalancer';
import { CreatedLink } from '../../types';
import { LinkAction, LinkActionTypes } from './types';

export const getLinks = () => async (dispatch: Dispatch<LinkAction>): Promise<void> => {
  const { data }: { data: CreatedLink[] } = await loadBalancer.get('/userlinks');

  dispatch({
    type: LinkActionTypes.GET_LINKS,
    payload: data,
  });
};

export const addLink = (longLink: string) => async (
  dispatch: Dispatch<LinkAction>
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
    console.log(err);
  }
};

export const deleteLink = (shortLink: string) => async (
  dispatch: Dispatch<LinkAction>
): Promise<void> => {
  await loadBalancer.delete(`/link/${shortLink}`);

  dispatch({
    type: LinkActionTypes.DELETE_LINK,
    payload: shortLink,
  });
};
