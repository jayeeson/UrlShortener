import mysql from 'mysql';
import axios from 'axios';
import { Server } from 'http';
import config from '../utils/config';
import { exitDb } from './db';

export async function exitGracefully(code: NodeJS.Signals, server: Server) {
  console.log(`About to exit with code ${code}`);
  try {
    await axios.post(`${config.coordinatorUrl}/exitnotification`, { serviceData: config.serviceData });

    server.close();
    exitDb(config.db);
    console.log('Server successfully terminated');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(1);
  }
}

export function exitGracefullyOnSignals(signals: NodeJS.Signals[], server: Server) {
  signals.forEach(signal => {
    process.on(signal, code => {
      exitGracefully(code, server);
    });
  });
}
