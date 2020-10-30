import express, { Router } from 'express';
import mysql, { OkPacket } from 'mysql';
import { ServiceData, ServiceNames } from './types';
import { sqlQuery, sqlAlter } from './helpers/db';
import {
  requestLargestReservedIdFromAllActiveUrlShorteners,
  requestLargestReservedIdFromUrlShortenerDatabase,
  sendLoadBalancerToAllUrlShorteners,
  sendLoadBalancerToUrlShortener,
  sendServiceUpdateToLoadBalancer,
} from './helpers/axios';
import { hasServiceData } from './middleware/validators';
import config from './utils/config';

const router = express.Router();
export const routes = (pool: mysql.Pool): Router => {
  let largestReservedId: number | undefined;

  router.get('/', (req, res) => {
    res.send('Hit the coordinator root url');
  });

  router.get('/getservices/:service', async (req, res) => {
    console.log(req.body);
    const { service } = req.params;
    try {
      const queryResponse =
        service === undefined
          ? await sqlQuery<ServiceData>(pool, 'SELECT url, name FROM service')
          : await sqlQuery<ServiceData>(pool, 'SELECT url, name FROM service WHERE name = (?)', [service]);

      const services = Object.assign({}, queryResponse);
      res.send({ services: services });
    } catch (err) {
      console.log(err);
      res.status(400).send('error');
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
          sendLoadBalancerToUrlShortener(pool, serviceData);
        } else if (serviceData.name === ServiceNames.loadBalancer) {
          sendLoadBalancerToAllUrlShorteners(pool, serviceData);
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
      await sqlAlter<any>(pool, 'DELETE FROM service WHERE name = ? AND url = ? ', params);

      sendServiceUpdateToLoadBalancer(pool);
      res.send('deletion request received and acted upon');
    } catch (err) {
      console.log(err);
      res.status(400).send('error');
    }
  });

  router.get('/shortlinkrange', async (req, res) => {
    if (!req.headers.referer) {
      return res.send('error, missing referer header');
    }

    const localLargestReservedId =
      largestReservedId ||
      (await requestLargestReservedIdFromAllActiveUrlShorteners(pool)) ||
      (await requestLargestReservedIdFromUrlShortenerDatabase(req.headers.referer));

    res.send({
      start: typeof localLargestReservedId === 'number' ? localLargestReservedId + 1 : 0,
      end:
        typeof localLargestReservedId === 'number'
          ? localLargestReservedId + config.shortlinkTrancheSize
          : config.shortlinkTrancheSize,
    });

    largestReservedId =
      typeof localLargestReservedId === 'number'
        ? localLargestReservedId + config.shortlinkTrancheSize
        : config.shortlinkTrancheSize;
  });

  return router;
};
