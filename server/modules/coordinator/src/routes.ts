import express, { Router } from 'express';
import mysql, { OkPacket } from 'mysql';
import { ServiceData, ServiceNames, StateChange } from './types';
import { sqlQuery, sqlAlter } from './helpers/db';
import {
  sendServiceUpdateToLoadBalancer,
  sendUei,
  sendUserAuthenticatorsToUrlShortener,
  sendUserAuthenticatorUpdateToUrlShorteners,
} from './helpers/axios';
import config from './utils/config';
import { hasServiceData } from './middleware/validators';

const router = express.Router();
export const routes = (pool: mysql.Pool): Router => {
  router.get('/', (req, res) => {
    res.send('Hit the coordinator root url');
  });

  router.get('/getservices', async (req, res) => {
    console.log(req.body);
    const { service } = req.body;
    try {
      const queryResponse =
        service === undefined
          ? await sqlQuery<ServiceData>(pool, 'SELECT url, name FROM service')
          : await sqlQuery<ServiceData>(pool, 'SELECT url, name FROM service WHERE name = (?)', [service]);

      const services = Object.assign({}, queryResponse);
      console.log({ services: services });
      res.send({ services: services });
    } catch (err) {
      console.log(err);
      res.send('error');
    }
  });

  router.post('/startnotification', hasServiceData, async (req, res) => {
    const serviceData = req.body.serviceData as ServiceData;
    const queryParams = [serviceData.name, serviceData.url];

    try {
      const queryResponse = await sqlAlter<OkPacket>(
        pool,
        'REPLACE INTO service (name, url) VALUES (?,?)',
        queryParams
      );

      if (queryResponse.affectedRows > 0) {
        sendServiceUpdateToLoadBalancer(pool);
        if (serviceData.name === ServiceNames.urlShortener) {
          await sendUei(serviceData, queryResponse.insertId);
          sendUserAuthenticatorsToUrlShortener(await config.pool, serviceData);
        } else if (serviceData.name === ServiceNames.userAuthenticator) {
          const userAuthenticatorUpdate = [{ userAuthenticator: serviceData, state: StateChange.online }];
          sendUserAuthenticatorUpdateToUrlShorteners(await config.pool, userAuthenticatorUpdate);
        }

        const serviceAddedMessage = `Adding row for service ${serviceData.name.toLocaleUpperCase()}; url=${serviceData.url.toLocaleUpperCase()}`;
        res.send(serviceAddedMessage);
        console.log(serviceAddedMessage);
      } else {
        res.send('no rows changed');
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: 'error' });
    }
  });

  router.post('/exitnotification', hasServiceData, async (req, res) => {
    const serviceData = req.body.serviceData as ServiceData;
    if (!serviceData) {
      return res.send('missing serviceData key');
    }

    console.log(`Exit notification received from service:\n  ${JSON.stringify(req.body)}`);
    const params = [serviceData.name, serviceData.url];
    try {
      await sqlQuery<any>(pool, 'DELETE FROM service WHERE name = ? AND url = ? ', params);

      sendServiceUpdateToLoadBalancer(pool);
      if (serviceData.name === ServiceNames.userAuthenticator) {
        const userAuthenticatorUpdate = [{ userAuthenticator: serviceData, state: StateChange.offline }];
        sendUserAuthenticatorUpdateToUrlShorteners(await config.pool, userAuthenticatorUpdate);
      }
      res.send('deletion request received and acted upon');
    } catch (err) {
      console.log(err);
      res.send('error');
    }
  });

  return router;
};
