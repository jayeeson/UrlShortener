import express from 'express';
import { ServiceNameTypes, ServiceUpdate, ServiceUrls } from '../types';
import config from '../utils/config';

export const router = express.Router();

export const serviceUrls: ServiceUrls = {
  loadBalancer: [],
  urlShortener: [],
  userAuthenticator: [],
};

const filterUrlsByServiceName = (serviceUpdate: ServiceUpdate, name: ServiceNameTypes) => {
  return serviceUpdate.services.filter(service => service.name === name).map(service => service.url);
};

router.post('/serviceupdate', (req, res) => {
  const activeServices: ServiceUpdate = req.body;
  console.log('service update received from coordinator:');
  console.log(activeServices);

  let key: keyof typeof serviceUrls;
  for (key in serviceUrls) {
    serviceUrls[key] = filterUrlsByServiceName(activeServices, config.serviceNames[key]);
  }

  res.send(req.body);
});
