import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

import { exitGracefullyOnSignals } from './helpers/exit';
import { router as coordinatorRoutes } from './routes/coordinator';
import { router as loadBalancerRoutes } from './routes/loadBalancer';
import { rateLimiter } from './middleware';
import config from './utils/config';
import { proxyHandler } from './routes/proxy';

const app = express();

app.use(bodyParser.json());
app.use(rateLimiter);

app.use(coordinatorRoutes);
app.use(loadBalancerRoutes);
app.all('*', proxyHandler);

const server = app.listen(config.port, config.hostname, () => {
  console.log(`Running server on port ${config.port}`);
  axios
    .post(`${config.coordinatorUrl}/startnotification/`, { serviceData: config.serviceData })
    .then(response =>
      console.log(
        `Start Notification response received from Coordinator:\n  status: ${response.status}\n  response data: ${response.data}`
      )
    )
    .catch(err => {
      console.log(err);
    });
});

exitGracefullyOnSignals(config.exitSignals, server);
