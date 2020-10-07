export interface DbOptions {
  host: string;
  user: string;
  password: string;
  database?: string;
}

export interface ServiceData {
  id?: number;
  name: string;
  url: string;
}

export interface UserAuthenticatorUpdate {
  userAuthenticator: ServiceData;
  state: StateChange;
}

export enum StateChange {
  offline = 0,
  online = 1,
}
