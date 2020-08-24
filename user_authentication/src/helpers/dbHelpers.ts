import mysql from 'mysql';
import { DbOptions } from '../types';
import config from '../config';

// MySQL DB CONNECTION / SETUP

export const _dbCreation = (options: DbOptions) => {
  return mysql.createConnection(options);
};

export const _dbConnect = (db: mysql.Connection) => {
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('connected to MySQL server');
  });
};

export async function _seedDB(db: mysql.Connection) {
  return new Promise(async (resolve, reject) => {
    try {
      const createDbResponse = await asyncQuery(
        db,
        'CREATE DATABASE IF NOT EXISTS user_authentication;'
      );
      const useCoordinatorResponse = await asyncQuery(
        db,
        'USE user_authentication;'
      );
      const createTableResponse = await asyncQuery(
        db,
        `CREATE TABLE IF NOT EXISTS user (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(128) NOT NULL UNIQUE,
          password VARCHAR(128) NOT NULL
        );`
      );
      resolve(createTableResponse);
    } catch (err) {
      console.log(err);
    }
  });
}

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
