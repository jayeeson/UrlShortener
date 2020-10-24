import jwt from 'jsonwebtoken';
import { sqlQuery, sqlAlter } from '../db';
import config from '../../utils/config';
import { Blacklist, DecodedToken } from '../../types';

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  try {
    const row = await sqlQuery<any>(await config.pool, 'SELECT * FROM blacklist WHERE (token) = (?)', [token]);

    return row.length > 0;
  } catch (err) {
    console.log(err);
    return true;
  }
}

export async function deleteTokenFromBlacklist(token: string): Promise<void> {
  await sqlAlter<any>(await config.pool, 'DELETE FROM blacklist WHERE token = (?)', [token]);
}

export async function clearExpiredTokensFromBlacklist(): Promise<void> {
  try {
    const allRows = await sqlQuery<Blacklist>(await config.pool, 'SELECT * FROM blacklist');
    allRows.map(async row => {
      const { token } = row;
      try {
        jwt.verify(token, config.secret.publicKey) as DecodedToken;
      } catch (err) {
        await deleteTokenFromBlacklist(token);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

export async function insertTokenInBlacklist(token: string): Promise<void> {
  try {
    await sqlAlter<any>(await config.pool, 'INSERT INTO blacklist (token) VALUES (?)', [token]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      //ok
    } else {
      throw err;
    }
  }
}
