import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import session from 'express-session';

import config from './utils/config';
import { router as coordinatorRoutes } from './routes/coordinator';
import { router as userRoutes } from './routes/userAuthenticator';
import { clearBlacklistOnInterval } from './utils/maintenance';

const app = express();

app.use(bodyParser.json());
app.use(
  session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(coordinatorRoutes);
app.use(userRoutes);

clearBlacklistOnInterval(config.blacklist.clearTimeIntervalMinutes);

app.listen(config.port, config.hostname, () => {
  console.log(`Running user_authentication service on port ${config.port}`);
  axios
    .post(`${config.coordinatorUrl}/startnotification/`, config.serviceData)
    .then((response) =>
      console.log(
        `Start Notification sent to Coordinator.\n  status: ${response.status}\n  response data: ${response.data}`
      )
    )
    .catch((err) => {
      console.log(err);
    });
});
