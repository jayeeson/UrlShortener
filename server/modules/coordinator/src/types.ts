export interface ServiceData {
  id?: number;
  name: string;
  url: string;
}

export interface DbOptions {
  host: string;
  user: string;
  password: string;
  database?: string;
}

export interface UserAuthenticatorUpdate {
  userAuthenticator: ServiceData;
  state: StateChange;
}

export enum ServiceNames {
  urlShortener = 'url_shortener',
  loadBalancer = 'load_balancer',
  userAuthenticator = 'user_authenticator',
}

export enum StateChange {
  offline = 0,
  online = 1,
}
