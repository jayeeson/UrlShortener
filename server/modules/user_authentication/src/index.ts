import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cookieParser from 'cookie-parser';

import config from './utils/config';
import { router as coordinatorRoutes } from './routes/coordinator';
import { router as userRoutes } from './routes/userAuthenticator';
import { clearBlacklistOnInterval } from './utils/maintenance';
import { exitGracefullyOnSignals } from './helpers/exit';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(coordinatorRoutes);
app.use(userRoutes);

clearBlacklistOnInterval(config.blacklist.clearTimeIntervalMinutes);

const server = app.listen(config.port, config.hostname, () => {
  console.log(`Running user_authentication service on port ${config.port}`);
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
