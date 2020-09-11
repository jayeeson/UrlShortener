import axios from 'axios';
import { Server } from 'http';
import config from '../utils/config';
import { exitDb } from './db';

export async function exitGracefully(code: NodeJS.Signals, server: Server): Promise<void> {
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

export function exitGracefullyOnSignals(signals: NodeJS.Signals[], server: Server): void {
  signals.forEach(signal => {
    process.on(signal, code => {
      exitGracefully(code, server);
    });
  });
}
