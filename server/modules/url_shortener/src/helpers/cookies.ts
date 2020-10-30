import { Request } from 'express';
import config from '../utils/config';
import { verifyToken } from './jwt';

export function getAuthOrGuestCookie(req: Request): string | undefined {
  const jwtCookie = req.cookies[config.jwt.cookieName];
  if (jwtCookie) {
    return jwtCookie as string;
  }

  const guestCookie = req.cookies[config.jwt.guestCookie];
  if (guestCookie) {
    return guestCookie as string;
  }
  return undefined;
}

export async function getUsernameFromCookie(req: Request): Promise<string | undefined> {
  const cookie = getAuthOrGuestCookie(req);
  if (cookie) {
    const decoded = await verifyToken(cookie);
    if (decoded) {
      return decoded.username;
    }
  }
  return undefined;
}
