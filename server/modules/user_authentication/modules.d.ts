declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    HOST: string;
    PORT: string;
    DBUSER: string;
    DBPASS: string;
    SERVICE_NAME: string;
    COORDINATOR_URL_ROOT: string;
    SECRET_TOKEN: string;
  }
}
