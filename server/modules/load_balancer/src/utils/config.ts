import mysql from 'mysql';
import dotenv from 'dotenv';
import { DbOptions, ServiceData, ServiceNames } from '../types';
import { seedDB, createPoolAndHandleDisconnect } from '../helpers/db';
import { getPort } from '../helpers/port';

dotenv.config();

const coordinatorUrl = process.env.COORDINATOR_URL_ROOT ?? 'http://localhost:3000';
const hostname = process.env.HOST || 'localhost';
const port = getPort();
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

const serviceNames: ServiceNames = {
  urlShortener: 'url_shortener',
  userAuthenticator: 'user_authenticator',
  loadBalancer: 'load_balancer',
};

const routes = {
  urlShortener: ['/new', '/userlinks', '/link/:id'],
  userAuthenticator: [
    '/register',
    '/login',
    '/logout',
    '/deleteUser',
    '/state',
    '/jwt/key',
    '/jwt/blacklisted',
    '/jwt/guest',
    '/jwt/status',
  ],
  loadBalancer: ['/serviceupdate', '/ping'],
};

const jwt = {
  cookieName: 'auth-jwt',
};

const exitSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

export default {
  coordinatorUrl,
  hostname,
  port,
  serviceData,
  pool: connectPool(),
  serviceNames,
  routes,
  jwt,
  exitSignals,
};
