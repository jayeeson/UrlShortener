import mysql from 'mysql';
import { ServiceData } from '../types';
import { sqlQuery } from './db';

export async function queryActiveServices(pool: mysql.Pool, serviceName?: string): Promise<ServiceData[]> {
  const response: ServiceData[] = serviceName
    ? await sqlQuery<any>(pool, 'SELECT * FROM service WHERE name = (?)', [serviceName])
    : await sqlQuery<any>(pool, 'SELECT * FROM service');

  const services = response.map(row => Object.assign({}, row)); // convert RowDataPacket to Object
  return services;
}
