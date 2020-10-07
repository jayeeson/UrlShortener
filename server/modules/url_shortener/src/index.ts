import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { router as coordinatorRoutes } from './routes/coordinator';
import { routes } from './routes/urlShortener';
import { getHighestRange, getShortLinkRange } from './Counter';
import { exitGracefullyOnSignals } from './helpers/exit';
import config from './utils/config';

const app = express();
app.use(express.static('views'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

(async () => {
  // setup counter
  ///\todo: make counter a microservice
  await getHighestRange();
  const startingMinMaxRange = await getShortLinkRange();

  app.use(coordinatorRoutes);
  app.use(routes(startingMinMaxRange));
  const server = app.listen(config.port, config.hostname, () => {
    console.log(`Running server on port ${config.port}!!`);
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
})();
