import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { DecodedToken, ServiceData } from '../types';

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

export async function getUserAuthenticatorPublicKey(): Promise<string | undefined> {
  try {
    const { data }: { data: { services: { [index: number]: ServiceData } } } = await axios.get(
      `${process.env.COORDINATOR_URL_ROOT}/getservices/${config.serviceNames.userAuthenticator}`
    );

    const services = Object.values(data.services);
    if (services.length) {
      if (data) {
        const authHost = services[0].url;
        const response = await axios.get(`${authHost}/jwt/key`);
        process.env.USER_AUTH_JWT_KEY = response.data;
        return response.data;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export async function verifyToken(token: string): Promise<DecodedToken | undefined> {
  if (!token) {
    return undefined;
  }

  const key = process.env.USER_AUTH_JWT_KEY || (await getUserAuthenticatorPublicKey());
  if (!key) {
    return undefined;
  }

  const decoded = jwt.verify(token, key, { algorithms: [config.jwt.verify.alg] }) as DecodedToken;
  if (decoded) {
    return decoded;
  }
  return undefined;
}
