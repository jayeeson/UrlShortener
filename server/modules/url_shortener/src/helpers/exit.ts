import { Server } from 'http';
import axios from 'axios';
import config from '../utils/config';
import { exitDb } from './db';
import { deleteUserAuthenticatorsList } from './redis';

export async function exitGracefully(server: Server, code: NodeJS.Signals): Promise<void> {
  console.log(`About to exit with code ${code}`);
  try {
    await axios.post(`${config.coordinatorUrl}/exitnotification`, { serviceData: config.serviceData });

    server.close();
    exitDb(await config.pool);
    deleteUserAuthenticatorsList();
    config.redis.client.QUIT();
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
      exitGracefully(server, code);
    });
  });
}
