import express from 'express';
import { ServiceData } from '../types';
import config from '../utils/config';

export const router = express.Router();

router.get('/ping', (req, res) => {
  res.send(config.serviceData);
});

router.post('/loadbalancer', (req, res) => {
  const { serviceUpdate }: { serviceUpdate: ServiceData } = req.body;
  if (!serviceUpdate || serviceUpdate.name !== config.serviceNames.loadBalancer) {
    return res.send('missing serviceUpdate key with load balancer info');
  }

  process.env.LOAD_BALANCER_URL_ROOT = serviceUpdate.url;
  res.send('load balancer url update received');
});
