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
}
