import express from 'express';
import { ServiceUpdate } from '../types';
import config from '../utils/config';

export const router = express.Router();
export let urlShortenerUrls: string[] = [];

router.post('/serviceupdate', (req, res) => {
  const activeServices: ServiceUpdate = req.body;
  console.log('service update received from coordinator:');
  console.log(activeServices);

  const urlShorteners = activeServices.services.filter(activeService => {
    return activeService.name === config.serviceNames.urlShortener;
  });

  urlShortenerUrls = urlShorteners.map(urlShortener => urlShortener.url);
  res.send(req.body);
});
