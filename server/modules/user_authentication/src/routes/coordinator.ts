import express from 'express';
import config from '../utils/config';

export const router = express.Router();

router.get('/ping', (req, res) => {
  res.send(config.serviceData);
});
