import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { Response, NextFunction, Request } from 'express';
import { asyncQuery } from '../helpers/db';

function forbidAccess(res: Response) {
  res.send('Do not have required access');
  res.end();
}

async function isTokenBlacklisted(token: string) {
  try {
    const row = await asyncQuery<any>(
      config.db,
      'SELECT * FROM blacklist WHERE (token) = (?)',
      [token]
    );

    return row.length > 0;
  } catch (err) {
    console.log(err);
    return true;
  }
}

async function isTokenValid(token: string) {
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

export const isSignedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string | null = req.session?.jwt;

  try {
    if (token && isTokenValid(token)) {
      next();
    } else {
      forbidAccess(res);
    }
  } catch (err) {
    console.log(err);
    forbidAccess(res);
  }
};

///\todo: middleware to ensure only THIS user can affect THIS user (Delete request...)
