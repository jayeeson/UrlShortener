import express from 'express';
import { getUserAuthenticatorPublicKey } from '../helpers/jwt';
import { deleteUserAuthenticatorsList } from '../helpers/redis';
import { ServiceData, StateChange, UserAuthenticatorUpdate } from '../types';
import config from '../utils/config';

export const router = express.Router();

router.get('/ping', (req, res) => {
  res.send(config.serviceData);
});

router.post('/uei', (req, res) => {
  const { uei }: { uei: number } = req.body;
  if (!uei) {
    return res.status(400).send('missing uei key');
  }

  process.env.UEI = uei.toString();
  console.log('UEI:', uei);
  res.send(`uei: ${uei}`);
});

router.post('/userauthenticator/all', (req, res) => {
  const { userAuthenticators }: { userAuthenticators: ServiceData[] } = req.body;
  if (!userAuthenticators) {
    return res.status(400).send('missing userAuthenticators key');
  }

  const uei = process.env.UEI;
  if (!uei) {
    return res.status(400).send('service error: unable to receive update');
  }

  deleteUserAuthenticatorsList();

  const userAuthenticatorUrls = userAuthenticators.map(userAuthenticator => userAuthenticator.url);
  if (userAuthenticatorUrls.length > 0) {
    config.redis.client.RPUSH(`urlShortener:${uei}:userAuthenticators`, userAuthenticatorUrls);
  }

  getUserAuthenticatorPublicKey(uei);
  res.send('user authenticator list received');
});

router.post('/userauthenticator/update', (req, res) => {
  const { serviceUpdate }: { serviceUpdate: UserAuthenticatorUpdate[] } = req.body;

  if (!serviceUpdate) {
    return res.status(400).send('missing userAuthenticatorUpdate key');
  }

  const uei = process.env.UEI;
  if (!uei) {
    return res.status(400).send('service error: unable to receive update');
  }

  const userAuthenticatorUpdateOffline = serviceUpdate.filter(eachUpdate => eachUpdate.state === StateChange.offline);

  userAuthenticatorUpdateOffline.map(eachUpdatedOffline => {
    config.redis.client.LREM(`urlShortener:${uei}:userAuthenticators`, 0, eachUpdatedOffline.userAuthenticator.url);
  });

  const userAuthenticatorUpdateOnlineUrls = serviceUpdate
    .filter(eachUpdate => eachUpdate.state === StateChange.online)
    .map(eachOnline => eachOnline.userAuthenticator.url);

  if (userAuthenticatorUpdateOnlineUrls.length > 0) {
    config.redis.client.RPUSH(`urlShortener:${uei}:userAuthenticators`, userAuthenticatorUpdateOnlineUrls);
  }

  getUserAuthenticatorPublicKey(uei);

  res.send('user authenticator update received');
});

router.post('/loadbalancer', (req, res) => {
  const { serviceUpdate }: { serviceUpdate: ServiceData } = req.body;
  if (!serviceUpdate || serviceUpdate.name !== config.serviceNames.loadBalancer) {
    return res.send('missing serviceUpdate key with load balancer info');
  }

  process.env.LOAD_BALANCER_URL_ROOT = serviceUpdate.url;
  res.send('load balancer url update received');
});
