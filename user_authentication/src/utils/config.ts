import mysql from 'mysql';
import dotenv from 'dotenv';
import { DbOptions, ServiceData } from '../types';
import { _dbCreation, _dbConnect, _seedDB } from '../helpers/db';
import { Secret } from 'jsonwebtoken';

dotenv.config();

const coordinatorUrl =
  process.env.COORDINATOR_URL_ROOT ?? 'http://localhost:3000';
const hostname = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3200;
process.env.URL_ROOT = `http://${hostname}:${port}`;

if (process.env.SECRET_TOKEN === undefined) {
  throw Error('missing SECRET_TOKEN environment variable');
}
const secret = process.env.SECRET_TOKEN;

const serviceData: ServiceData = {
  name: process.env.SERVICE_NAME ?? 'user_authentication',
  url: process.env.URL_ROOT ?? `http://${hostname}:${port}`,
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
};

export default {
  coordinatorUrl: coordinatorUrl,
  hostname: hostname,
  port: port,
  secret: secret,
  serviceData: serviceData,
  db: connectDatabase(),
  jwt: jwt,
};
