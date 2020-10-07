import mysql from 'mysql';
import { DbOptions } from '../types';
export declare const asyncQuery: <T>(db: mysql.Connection, query: string, args?: any[] | undefined) => Promise<T[]>;
export declare const _dbCreation: (options: DbOptions) => mysql.Connection;
export declare const _dbConnect: (db: mysql.Connection) => void;
export declare function _seedDB(db: mysql.Connection): Promise<void>;
export declare function exitDb(db: mysql.Connection): void;
export declare function storeLinkInDb(db: mysql.Connection, shortLink: string, longLink: string): Promise<any>;
