import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
import { DbOptions, ServiceData } from './types';
import { dbCreation, dbConnect, seedDB } from './helpers/dbHelpers';
import { router as coordinatorRoutes } from './routes/coordinator';
import { router as userRoutes } from './routes/userAuthenticator';

dotenv.config();

const coordinatorUrl =
  process.env.COORDINATOR_URL_ROOT || 'http://localhost:3000';
const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3200;
process.env.URL_ROOT = `http://${hostname}:${port}`;

const app = express();

const dbOptions: DbOptions = {
  host: hostname,
  user: process.env.DBUSER as string,
  password: process.env.DBPASS as string,
};

export const db = dbCreation(dbOptions);
dbConnect(db);
try {
  seedDB(db);
} catch (err) {
  console.log(err);
}

app.use(bodyParser.json());

////////////
// ROUTES //
////////////

app.use(coordinatorRoutes);
app.use(userRoutes);

// POST ROUTE
//app.post('')

const serviceData: ServiceData = {
  name: process.env.SERVICE_NAME || 'user_authentication',
  url: process.env.URL_ROOT || `http://${hostname}:${port}`,
};

app.listen(port, hostname, () => {
  console.log(`Running user_authentication service on port ${port}`);
  axios
    .post(`${coordinatorUrl}/startnotification/`, serviceData)
    .then((response) =>
      console.log(
        `Start Notification sent to Coordinator.\n  status: ${response.status}\n  response data: ${response.data}`
      )
    )
    .catch((err) => {
      console.log(err);
    });
});
