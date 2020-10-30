import mysql, { OkPacket } from 'mysql';
import { ServiceData } from '../types';
import { getExpiredServices, sendServiceUpdateToLoadBalancer } from './axios';
import { sqlQuery, sqlAlter } from './db';

export const pingServices = async (pool: mysql.Pool): Promise<void> => {
  const servicesInTable = await sqlQuery<ServiceData>(pool, 'SELECT * FROM service');
  const expiredElements = await getExpiredServices(servicesInTable);

  const filteredExpiredElements = expiredElements.filter((expiredElement): expiredElement is ServiceData => {
    return expiredElement !== null;
  });

  if (filteredExpiredElements.length > 0) {
    const expiredIds = filteredExpiredElements.map(expiredElement => expiredElement.id);
    console.log('ping not responded to. deleting ids: ', expiredIds);

    await sqlAlter<OkPacket>(pool, 'DELETE FROM service WHERE id IN (?)', [expiredIds]);

    sendServiceUpdateToLoadBalancer(pool);
  }
};

export const pingServicesOnInterval = (pool: mysql.Pool, seconds: number): void => {
  setInterval(() => {
    pingServices(pool);
  }, seconds * 1000);
};
