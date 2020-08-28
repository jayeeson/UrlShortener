import config from '../utils/config';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from './sql/blacklist';
import { AccountType, DecodedToken } from '../types';

export const generateJwt = (username: string, accountType: AccountType) => {
  return jwt.sign({ username: username, accountType: accountType }, config.secret, {
    expiresIn: config.jwt.sign.options.expiresIn,
  });
};

export async function isTokenValid(token: string) {
  try {
    const decoded = jwt.verify(token, config.secret, config.jwt.verify.options);
    const isBlacklisted = await isTokenBlacklisted(token);
    if (decoded && !isBlacklisted) {
      return true;
    }
    console.log('invalid token');
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function useTokenIfValid(token: string) {
  if (isTokenValid(token)) {
    return jwt.verify(token, config.secret, config.jwt.verify.options) as DecodedToken;
  }
  return undefined;
}

export function isTokenOfAccountType(token: string, accountType: AccountType) {
  try {
    const decoded = jwt.verify(token, config.secret, config.jwt.verify.options) as DecodedToken;
    if (decoded) {
      return decoded.accountType === accountType;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}
