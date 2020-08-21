import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
import passport from 'passport';
import passportLocal from 'passport-local';
import { DbOptions, ServiceData } from './types';
import { dbCreation, dbConnect, seedDB } from './helpers/dbHelpers';
import { router as coordinatorRoutes } from './routes/coordinator';

dotenv.config();

const coordinatorUrl =
  process.env.COORDINATOR_URL_ROOT || 'http://localhost:3000';
const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3200;
process.env.URL_ROOT = `http://${hostname}:${port}`;

const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy((username, password, done) => {}));
const app = express();

const dbOptions: DbOptions = {
  host: hostname,
  user: process.env.DBUSER as string,
  password: process.env.DBPASS as string,
};

const db = dbCreation(dbOptions);
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

// GET HOMEPAGE ROUTE
app.get('/', (req, res) => {
  res.send('hit the main page of user_authentication');
});

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
