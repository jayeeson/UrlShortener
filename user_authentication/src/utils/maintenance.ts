import jwt from 'jsonwebtoken';
import config from './config';

import { asyncQuery } from '../helpers/db';
import { Blacklist, Token } from '../types';

const msToHours = 1000 * 60 * 60;

export const clearBlacklistOnInterval = (hours: number) => {
  setInterval(() => {
    clearExpiredTokensFromBlacklist();
  }, hours * 1000);
};

async function clearExpiredTokensFromBlacklist() {
  try {
    const allRows = await asyncQuery<Blacklist>(
      config.db,
      'SELECT * FROM blacklist'
    );
    allRows.map((row) => {
      const token = row.token;
      const decoded = jwt.decode(token) as Token;
      if (decoded) {
        const now = Math.round(new Date().getTime() / 1000);
        if (decoded.exp < now) {
          deleteThisToken();
        }
      } else {
        deleteThisToken();
      }

      async function deleteThisToken() {
        await asyncQuery<any>(
          config.db,
          'DELETE FROM blacklist WHERE token = (?)',
          [token]
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
}
