import mysql from 'mysql';
import dotenv from 'dotenv';
import { DbOptions, ServiceData } from '../types';
import { _dbCreation, _dbConnect, _seedDB } from '../helpers/db';

dotenv.config();

const coordinatorUrl = process.env.COORDINATOR_URL_ROOT ?? 'http://localhost:3000';
const hostname = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3200;
const urlRoot = `http://${hostname}:${port}`;

if (process.env.SECRET_TOKEN === undefined) {
  throw Error('missing SECRET_TOKEN environment variable');
}
const secret = process.env.SECRET_TOKEN;

const serviceData: ServiceData = {
  name: process.env.SERVICE_NAME ?? 'user_authentication',
  url: urlRoot,
};

const dbOptions: DbOptions = {
  host: hostname,
  user: process.env.DBUSER as string,
  password: process.env.DBPASS as string,
};

let db: mysql.Connection;
function connectDatabase() {
  if (!db) {
    db = _dbCreation(dbOptions);
    _dbConnect(db);
    try {
      _seedDB(db);
    } catch (err) {
      console.log(err);
    }
  }
  return db;
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
  db: connectDatabase(),
  jwt,
  blacklist,
  exitSignals,
};
