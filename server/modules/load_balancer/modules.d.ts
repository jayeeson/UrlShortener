declare namespace NodeJS {
  export interface ProcessEnv {
    HOST: string;
    PORT: string;
    DBUSER: string;
    DBPASS: string;
    SERVICE_NAME: string;
    COORDINATOR_URL_ROOT: string;
  }
}
