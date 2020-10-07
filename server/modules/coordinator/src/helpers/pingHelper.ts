import mysql, { OkPacket } from 'mysql';
import { ServiceData, StateChange, ServiceNames } from '../types';
import {
  getExpiredServices,
  sendServiceUpdateToLoadBalancer,
  sendUserAuthenticatorUpdateToUrlShorteners,
} from './axios';
import { sqlQuery, sqlAlter } from './db';
import config from '../utils/config';

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
    sendExpiredUserAuthenticatorsToUrlShorteners(filteredExpiredElements);
  }
};

export const pingServicesOnInterval = (pool: mysql.Pool, seconds: number): void => {
  setInterval(() => {
    pingServices(pool);
  }, seconds * 1000);
};

async function sendExpiredUserAuthenticatorsToUrlShorteners(allExpiredServices: ServiceData[]): Promise<void> {
  const expiredUserAuthenticators = allExpiredServices.filter(
    expiredElement => expiredElement.name === ServiceNames.userAuthenticator
  );

  if (expiredUserAuthenticators.length > 0) {
    const userAuthenticatorUpdate = expiredUserAuthenticators.map(userAuthenticator => {
      return { userAuthenticator: userAuthenticator, state: StateChange.offline };
    });
    sendUserAuthenticatorUpdateToUrlShorteners(await config.pool, userAuthenticatorUpdate);
  }
}
