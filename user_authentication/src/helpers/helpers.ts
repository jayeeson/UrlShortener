import mysql from 'mysql';
import axios from 'axios';
import { Server } from 'http';
import { ServiceData } from '../types';

function exitDb(db: mysql.Connection) {
  db.end(err => {
    if (err) {
      console.log(`error: ${err.message}`);
    }
    console.log('Closed the database connection');
  });
}

export async function exitGracefully(
  code: NodeJS.Signals,
  server: Server,
  coordinatorUrl: string,
  serviceData: ServiceData,
  db?: mysql.Connection
) {
  // notify coordinator service
  console.log(`About to exit with code ${code}`);
  await axios.post(`${coordinatorUrl}/exitnotification`, serviceData).catch(err => console.log(err));

  // close all open handles
  server.close(() => {
    console.log('Server successfully terminated');
    if (db) {
      exitDb(db);
    }
    process.exit(1);
  });
}

export function exitGracefullyOnSignals(
  signals: NodeJS.Signals[],
  server: Server,
  coordinatorUrl: string,
  serviceData: ServiceData,
  db?: mysql.Connection
) {
  signals.forEach(signal => {
    process.on(signal, code => {
      exitGracefully(code, server, coordinatorUrl, serviceData, db);
    });
  });
}
