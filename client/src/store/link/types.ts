import { CreatedLink } from '../../types';

export enum LinkActionTypes {
  GET_LINKS = 'GET_LINKS',
  ADD_LINK = 'ADD_LINK',
  DELETE_LINK = 'DELETE_LINK',
}

interface GetLinksAction {
  type: LinkActionTypes.GET_LINKS;
  payload: CreatedLink[];
}

interface AddLinkAction {
  type: LinkActionTypes.ADD_LINK;
  payload: CreatedLink;
}

interface DeleteLinkAction {
  type: LinkActionTypes.DELETE_LINK;
  payload: string;
}

export type LinkAction = GetLinksAction | AddLinkAction | DeleteLinkAction;

export interface LinkState {
  [index: string]: CreatedLink;
}
