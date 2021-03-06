import redis from 'redis';
import mysql from 'mysql';
import dotenv from 'dotenv';
import { DbOptions, ServiceData } from '../types';
import { seedDB, createPoolAndHandleDisconnect } from '../helpers/db';
import { getPort } from '../helpers/port';
import { Algorithm } from 'jsonwebtoken';

dotenv.config();

const argStrings = {
  port: 'port=',
  redisPort: 'redisport=',
};

const coordinatorUrl = process.env.COORDINATOR_URL_ROOT ?? 'http://localhost:3000';
const hostname = process.env.HOST ?? 'localhost';
const port = getPort(argStrings.port, process.env.PORT) ?? 3007;
const redisPort = getPort(argStrings.redisPort, process.env.REDIS_PORT) ?? 6379;
const urlRoot = `http://${hostname}:${port}`;

if (process.env.SERVICE_NAME === undefined) {
  throw Error('missing SERVICE_NAME environment variable');
}

const serviceData: ServiceData = {
  name: process.env.SERVICE_NAME,
  url: urlRoot,
};

const seedDbOptions: DbOptions = {
  host: hostname,
  user: process.env.DBUSER ?? '',
  password: process.env.DBPASS ?? '',
};

const poolDbOptions: DbOptions = {
  ...seedDbOptions,
  database: process.env.SERVICE_NAME,
};

let dbSeeded = false;
let pool: mysql.Pool;
async function connectPool() {
  if (!dbSeeded) {
    await seedDB(seedDbOptions);
  }
  dbSeeded = true;

  if (!pool) {
    pool = createPoolAndHandleDisconnect(poolDbOptions);
  }
  return pool;
}

const redisClient = redis.createClient(redisPort, hostname);
redisClient.on('connect', () => console.log('connected to redis on port', redisPort));
redisClient.on('error', err => console.log('Error connecting to redis\n', err));

const serviceNames = {
  userAuthenticator: 'user_authenticator',
  loadBalancer: 'load_balancer',
};

const jwt = {
  cookieName: 'auth-jwt',
  guestCookie: 'guest-jwt',
  verify: {
    alg: 'RS256' as Algorithm,
  },
};

const exitSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

export default {
  argStrings,
  coordinatorUrl,
  hostname,
  port,
  redis: {
    host: hostname,
    port: redisPort,
    client: redisClient,
  },
  serviceData,
  pool: connectPool(),
  serviceNames,
  jwt,
  exitSignals,
};
