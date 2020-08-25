import config from '../utils/config';
import jwt from 'jsonwebtoken';

export const generateJwt = (username: string) => {
  return jwt.sign({ username: username }, config.secret, {
    expiresIn: '5m',
  });
};
