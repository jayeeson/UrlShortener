import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import config from './config';
import { router as coordinatorRoutes } from './routes/coordinator';
import { router as userRoutes } from './routes/userAuthenticator';

const app = express();

app.use(bodyParser.json());

app.use(coordinatorRoutes);
app.use(userRoutes);

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
