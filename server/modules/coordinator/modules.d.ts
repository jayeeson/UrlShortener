declare namespace NodeJS {
  export interface ProcessEnv {
    HOST: string;
    PORT: string;
    DBUSER: string;
    DBPASS: string;
    SERVICE_NAME: string;
  }
}
