import { Response, NextFunction, Request } from 'express';
import { isTokenValid } from '../helpers/jwt';
import config from '../utils/config';

function forbidAccess(res: Response) {
  res.send('Do not have required access');
  res.end();
}

export async function isSignedIn(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies[config.jwt.cookieName];

  try {
    if (token && (await isTokenValid(token))) {
      next();
    } else {
      forbidAccess(res);
    }
  } catch (err) {
    console.log(err);
    forbidAccess(res);
  }
}
