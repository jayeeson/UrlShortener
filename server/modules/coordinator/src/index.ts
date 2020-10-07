import express from 'express';
import bodyParser from 'body-parser';
import { pingServices, pingServicesOnInterval } from './helpers/pingHelper';
import config from './utils/config';
import { routes as CoordinatorRoutes } from './routes';
import { exitGracefullyOnSignals } from './helpers/exit';

(async () => {
  const app = express();
  app.use(bodyParser.json());

  ////////////
  // ROUTES //
  ////////////

  app.use(CoordinatorRoutes(await config.pool));

  const pingTimerSeconds = 300;
  pingServicesOnInterval(await config.pool, pingTimerSeconds);

  const server = app.listen(config.port, config.hostname, async () => {
    console.log(`Running server on port ${config.port}`);
    pingServices(await config.pool);
  });

  exitGracefullyOnSignals(config.exitSignals, server);
})();
