import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cookieParser from 'cookie-parser';

import { router as coordinatorRoutes } from './routes/coordinator';
import { routes } from './routes/urlShortener';
import { getHighestRange, getShortLinkRange } from './Counter';
import { exitGracefullyOnSignals } from './helpers/exit';
import config from './utils/config';
import { getUserAuthenticatorPublicKey } from './helpers/jwt';

const app = express();
app.use(express.static('views'));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

(async () => {
  // setup counter
  ///\todo: make counter a microservice
  await getHighestRange();
  const startingMinMaxRange = await getShortLinkRange();

  app.use(coordinatorRoutes);
  app.use(routes(startingMinMaxRange));
  const server = app.listen(config.port, config.hostname, async () => {
    console.log('Running server on port', config.port);
    try {
      const startResponse = await axios.post(`${config.coordinatorUrl}/startnotification/`, {
        serviceData: config.serviceData,
      });
      console.log(
        'Start Notification response received from Coordinator:\n',
        `  status: ${startResponse.status}\n  response data: ${startResponse.data}`
      );

      if (!process.env.USER_AUTH_JWT_KEY) {
        getUserAuthenticatorPublicKey();
      }
    } catch (err) {
      console.log(err);
    }
  });

  exitGracefullyOnSignals(config.exitSignals, server);
})();
