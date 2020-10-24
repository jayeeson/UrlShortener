import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { DecodedToken } from '../types';

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  if (!process.env.LOAD_BALANCER_URL_ROOT) {
    console.log('Cannot verify token validity, missing load balancer url in environment variables');
    return false;
  }
  try {
    const response = await axios.post(`${process.env.LOAD_BALANCER_URL_ROOT}/jwt/blacklisted`, { token });

    if (response.data === false) {
      return false;
    }
    return true;
  } catch {
    return true;
  }
}

export function getUserAuthenticatorPublicKey(uei: string): void {
  config.redis.client.LRANGE(`urlShortener:${uei}:userAuthenticators`, 0, 0, async (err, val) => {
    if (!process.env.USER_AUTH_JWT_KEY && val.length > 0) {
      try {
        const { data } = await axios.get(`${val[0]}/jwt/key`);
        if (data) {
          process.env.USER_AUTH_JWT_KEY = data;
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
}

export function verifyToken(token: string): DecodedToken | undefined {
  const key = process.env.USER_AUTH_JWT_KEY;
  if (!key || !token) {
    return undefined;
  }

  const decoded = jwt.verify(token, key, { algorithms: [config.jwt.verify.alg] }) as DecodedToken;
  if (decoded) {
    return decoded;
  }
  return undefined;
}
