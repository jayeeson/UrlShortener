import mysql from 'mysql';
import dotenv from 'dotenv';
import { DbOptions } from '../types';
import { seedDB, createPoolAndHandleDisconnect } from '../helpers/db';

dotenv.config();

const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
process.env.URL_ROOT = `http://${hostname}:${port}`;

if (process.env.SERVICE_NAME === undefined) {
  throw Error('missing SERVICE_NAME environment variable');
}

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

const exitSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

export default {
  hostname,
  port,
  pool: connectPool(),
  exitSignals,
};
