import mysql from 'mysql';
import { DbOptions } from '../types';

export const sqlQuery = async <T>(pool: mysql.Pool, query: string, args?: any[]): Promise<T[]> => {
  return new Promise<T[]>((resolve, reject) => {
    pool.query(query, args, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

export const sqlAlter = async <T>(pool: mysql.Pool, query: string, args?: any[]): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    pool.query(query, args, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

// MySQL DB CONNECTION / SETUP
export async function seedDB(dbOptions: DbOptions): Promise<void> {
  try {
    const db = mysql.createConnection(dbOptions);
    db.connect();
    const queries = [
      `CREATE DATABASE IF NOT EXISTS ${process.env.SERVICE_NAME};`,
      `USE ${process.env.SERVICE_NAME}`,
      `CREATE TABLE IF NOT EXISTS rate_limiter (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          ip VARCHAR(128) NOT NULL UNIQUE,
          frequency INT NOT NULL,
          timestamp TIMESTAMP NOT NULL
        );`,
    ];

    const queryResponses = queries.map(query => {
      return new Promise<string>((resolve, reject) => {
        db.query(query, (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        });
      });
    });

    return Promise.all(queryResponses).then(() => {
      db.end();
    });
  } catch (err) {
    console.log(err);
  }
}

let pool: mysql.Pool;
export function createPoolAndHandleDisconnect(dbOptions: DbOptions): mysql.Pool {
  pool = mysql.createPool(dbOptions);
  pool.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      setTimeout(() => {
        createPoolAndHandleDisconnect(dbOptions);
      }, 3000);
    } else {
      throw err;
    }
  });
  return pool;
}

export function exitDb(pool: mysql.Pool): void {
  if (pool) {
    pool.end(err => {
      if (err) {
        console.log(`error: ${err.message}`);
      }
      console.log('Closed the database connection');
    });
  }
}
