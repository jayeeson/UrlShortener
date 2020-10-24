import config from '../utils/config';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from './sql/blacklist';
import { AccountType, DecodedToken } from '../types';
import { Request, Response } from 'express';

export const generateJwt = (username: string, accountType: AccountType, expiresIn?: string): string => {
  return jwt.sign({ username: username, accountType: accountType }, config.secret.privateKey, {
    expiresIn: expiresIn ?? config.jwt.sign.options.expiresIn,
    algorithm: config.jwt.sign.options.algorithm,
  });
};

export async function isTokenValid(token: string): Promise<boolean> {
  try {
    const decoded = jwt.verify(token, config.secret.publicKey, config.jwt.verify.options);
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

export async function useTokenIfValid(token: string): Promise<DecodedToken | undefined> {
  if (isTokenValid(token)) {
    return jwt.verify(token, config.secret.publicKey, config.jwt.verify.options) as DecodedToken;
  }
  return undefined;
}

export function isTokenOfAccountType(token: string, accountType: AccountType): boolean {
  try {
    const decoded = jwt.verify(token, config.secret.publicKey, config.jwt.verify.options) as DecodedToken;
    if (decoded) {
      return decoded.accountType === accountType;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export function ifCookieTokenValidSendResponseString(
  req: Request,
  res: Response,
  cookieName: string,
  responseStr: string
): Response<any> | undefined {
  const token = req.cookies[cookieName];

  if (token) {
    const valid = isTokenValid(token);
    if (valid) {
      return res.status(200).send(responseStr);
    } else {
      res.clearCookie(cookieName);
    }
  }
}
