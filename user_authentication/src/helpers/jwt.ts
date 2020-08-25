import config from '../config';
import jwt from 'jsonwebtoken';

export const generateJwt = (username: string) => {
  return jwt.sign({ username: username }, config.secret, {
    expiresIn: '15s',
  });
};
