import config from '../utils/config';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from './sql/blacklist';

export const generateJwt = (username: string) => {
  return jwt.sign({ username: username }, config.secret, {
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
