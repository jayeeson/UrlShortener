import { NextFunction, Request, Response } from 'express';
import { isTokenBlacklisted } from './helpers/jwt';
import config from './utils/config';

async function useAuthTokenOrGuestToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies[config.jwt.cookieName];
  const guestToken = req.cookies[config.jwt.guestCookie];
  try {
    if (token) {
      const blacklisted = await isTokenBlacklisted(token);
      if (!blacklisted) {
        return next();
      }
    } else if (guestToken) {
      const blacklisted = await isTokenBlacklisted(token);
      if (!blacklisted) {
        return next();
      }
    }
    res.status(401).end();
  } catch {
    res.status(401).end();
  }
}

export default {
  useAuthTokenOrGuestToken,
};
