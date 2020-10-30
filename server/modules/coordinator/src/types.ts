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

export enum ServiceNames {
  urlShortener = 'url_shortener',
  loadBalancer = 'load_balancer',
  userAuthenticator = 'user_authenticator',
}
