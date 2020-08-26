import jwt from 'jsonwebtoken';
import config from './config';

import { asyncQuery } from '../helpers/db';
import { Blacklist, Token } from '../types';

const msToMinutes = 1000 * 60;

async function deleteToken(token: string) {
  await asyncQuery<any>(config.db, 'DELETE FROM blacklist WHERE token = (?)', [
    token,
  ]);
}

async function clearExpiredTokensFromBlacklist() {
  try {
    const allRows = await asyncQuery<Blacklist>(
      config.db,
      'SELECT * FROM blacklist'
    );
    allRows.map(row => {
      const { token } = row;
      const decoded = jwt.decode(token) as Token;

      if (decoded) {
        const now = Math.round(new Date().getTime() / 1000);
        if (decoded.exp < now) {
          deleteToken(token);
        }
      } else {
        deleteToken(token);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
export const clearBlacklistOnInterval = (minutes: number) => {
  setInterval(() => {
    clearExpiredTokensFromBlacklist();
  }, msToMinutes * minutes);
};
