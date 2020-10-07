// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Session {
      token: string;
    }
  }
}
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

export interface User {
  id: number;
  username: string;
  password: string;
  accountType: AccountType;
}

export interface Blacklist {
  id: number;
  token: string;
}

export interface DecodedToken {
  username: string;
  accountType: AccountType;
  iat: number;
  exp: number;
}

export enum AccountType {
  User = 'USER',
  Admin = 'ADMIN',
}
