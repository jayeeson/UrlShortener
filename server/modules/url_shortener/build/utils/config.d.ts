/// <reference types="node" />
import redis from 'redis';
import mysql from 'mysql';
import { ServiceData } from '../types';
declare const _default: {
    argStrings: {
        port: string;
        redisPort: string;
    };
    coordinatorUrl: string;
    hostname: string;
    port: number;
    redis: {
        host: string;
        port: number;
        client: redis.RedisClient;
    };
    serviceData: ServiceData;
    db: mysql.Connection;
    serviceNames: {
        userAuthenticator: string;
    };
    dbTrancheSize: number;
    exitSignals: NodeJS.Signals[];
};
export default _default;
