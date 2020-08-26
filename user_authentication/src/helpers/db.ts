import mysql from 'mysql';
import { DbOptions } from '../types';

export const asyncQuery = <T>(
  db: mysql.Connection,
  query: string,
  args?: any[]
): Promise<T[]> => {
  return new Promise<T[]>((resolve, reject) => {
    db.query(query, args, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

////////////////////////////////////////
// MySQL DB CONNECTION / SETUP / SEED //
////////////////////////////////////////

export const _dbCreation = (options: DbOptions) => {
  return mysql.createConnection(options);
};

export const _dbConnect = (db: mysql.Connection) => {
  db.connect(err => {
    if (err) {
      throw err;
    }
    console.log('connected to MySQL server');
  });
};

export async function _seedDB(db: mysql.Connection) {
  try {
    const queries = [
      'CREATE DATABASE IF NOT EXISTS user_authentication;',
      'USE user_authentication;',
      `CREATE TABLE IF NOT EXISTS user (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(128) NOT NULL UNIQUE,
          password VARCHAR(128) NOT NULL
        );`,
      `CREATE TABLE IF NOT EXISTS blacklist (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          token VARCHAR(256) NOT NULL UNIQUE
        );`,
    ];

    const queryResponses = queries.map(query => {
      asyncQuery<any>(db, query);
    });

    Promise.all(queryResponses).then(result => {
      console.log(result);
    });
  } catch (err) {
    console.log(err);
  }
}
