import { sqlQuery, sqlAlter } from './helpers/db';
import config from './utils/config';

///\todo: remove let
let highestUnusedId = 0;

export function getHighestRange(): Promise<number> {
  return new Promise<number>(async (resolve, reject) => {
    try {
      const result = await sqlQuery<any>(await config.pool, 'SELECT highest_unused_id FROM counter');

      if (result.length < 1) {
        await sqlAlter(await config.pool, 'INSERT INTO counter (highest_unused_id) VALUES (0)');
      } else {
        highestUnusedId = result[0].highest_unused_id;
        resolve(highestUnusedId);
      }
    } catch (err) {
      reject(err);
    }
  });
}

///\todo: make sure multiple instances of urlShortener will not overlap ids
export function getShortLinkRange(): Promise<{ min: number; max: number }> {
  return new Promise<{ min: number; max: number }>(async (resolve, reject) => {
    const min = highestUnusedId;
    const max = highestUnusedId + config.dbTrancheSize - 1;
    highestUnusedId += config.dbTrancheSize;

    try {
      await sqlAlter<any>(await config.pool, 'UPDATE counter SET highest_unused_id = ?', [highestUnusedId]);
      resolve({
        min: min,
        max: max,
      });
    } catch (err) {
      if (err) {
        reject(err);
      }
    }
  });
}
