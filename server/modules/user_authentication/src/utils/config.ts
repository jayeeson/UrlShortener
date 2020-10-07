import mysql from 'mysql';
import dotenv from 'dotenv';
import { DbOptions, ServiceData } from '../types';
import { createPoolAndHandleDisconnect, seedDB } from '../helpers/db';
import { getPort } from '../helpers/port';

dotenv.config();

const argStrings = {
  port: 'port=',
};

const coordinatorUrl = process.env.COORDINATOR_URL_ROOT ?? 'http://localhost:3000';
const hostname = process.env.HOST ?? 'localhost';
const port = getPort(argStrings.port, process.env.PORT) ?? 3200;
const urlRoot = `http://${hostname}:${port}`;

if (process.env.SECRET_TOKEN === undefined) {
  throw Error('missing SECRET_TOKEN environment variable');
}

if (process.env.SERVICE_NAME === undefined) {
  throw Error('missing SERVICE_NAME environment variable');
}
const secret = process.env.SECRET_TOKEN;

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

const jwt = {
  verify: {
    options: {
      maxAge: '7d',
    },
  },
  sign: {
    options: {
      expiresIn: '5m',
    },
  },
};

const blacklist = {
  clearTimeIntervalMinutes: 15,
};

const exitSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

export default {
  coordinatorUrl,
  hostname,
  port,
  secret,
  serviceData,
  pool: connectPool(),
  jwt,
  blacklist,
  exitSignals,
};
