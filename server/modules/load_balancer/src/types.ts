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
