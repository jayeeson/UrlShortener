import jwt from 'jsonwebtoken';
import { asyncQuery } from '../db';
import config from '../../utils/config';
import { Blacklist, Token } from '../../types';

export async function isTokenBlacklisted(token: string) {
  try {
    const row = await asyncQuery<any>(config.db, 'SELECT * FROM blacklist WHERE (token) = (?)', [token]);

    return row.length > 0;
  } catch (err) {
    console.log(err);
    return true;
  }
}

export async function deleteTokenFromBlacklist(token: string) {
  await asyncQuery<any>(config.db, 'DELETE FROM blacklist WHERE token = (?)', [token]);
}

export async function clearExpiredTokensFromBlacklist() {
  try {
    const allRows = await asyncQuery<Blacklist>(config.db, 'SELECT * FROM blacklist');
    allRows.map(row => {
      const { token } = row;
      const decoded = jwt.decode(token) as Token;

      if (decoded) {
        const now = Math.round(new Date().getTime() / 1000);
        if (decoded.exp < now) {
          deleteTokenFromBlacklist(token);
        }
      } else {
        deleteTokenFromBlacklist(token);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

export async function insertTokenInBlacklist(token: string) {
  return await asyncQuery<any>(config.db, 'INSERT INTO blacklist (token) VALUES (?)', [token]);
}
