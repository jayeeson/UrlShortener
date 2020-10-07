declare namespace NodeJS {
  export interface ProcessEnv {
    HOST: string | undefined;
    PORT: string | undefined;
    REDIS_PORT: string | undefined;
    DBUSER: string | undefined;
    DBPASS: string | undefined;
    SERVICE_NAME: string | undefined;
    COORDINATOR_URL_ROOT: string | undefined;
    UEI: string | undefined;
  }
}
