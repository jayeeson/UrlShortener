export interface ServiceData {
  id?: number;
  name: string;
  url: string;
}

export interface ServiceUpdate {
  services: {
    name: string;
    url: string;
  }[];
}

export interface DbOptions {
  host: string;
  user: string;
  password: string;
  database?: string;
}

export interface RateLimiterData {
  id: number;
  ip: string;
  frequency: number;
  timestamp: string;
}

export enum IsRequestAllowed {
  YES = 0,
  REQUEST_LIMIT_EXCEEDED = 1,
}

export interface ServiceUrls {
  loadBalancer: string[];
  urlShortener: string[];
  userAuthenticator: string[];
}

export interface ServiceNames {
  urlShortener: ServiceNameTypes;
  userAuthenticator: ServiceNameTypes;
  loadBalancer: ServiceNameTypes;
}

export type ServiceNameTypes = 'url_shortener' | 'user_authenticator' | 'load_balancer';
