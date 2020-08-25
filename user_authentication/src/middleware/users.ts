import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { Response, NextFunction, Request } from 'express';
import { asyncQuery } from '../helpers/db';

export const isSignedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.session!.jwt;

  try {
    if (token) {
      const decoded = jwt.verify(token, config.secret, { maxAge: '7d' });
      console.log(decoded);

      if (decoded) {
        const row = await asyncQuery<any>(
          config.db,
          'SELECT * FROM blacklist WHERE (token) = (?)',
          [token]
        );

        if (row.length > 0) {
          forbidAccess(res);
        }
      }
      next();
    } else {
      forbidAccess(res);
    }
  } catch (err) {
    console.log(err);
    forbidAccess(res);
  }
};

function forbidAccess(res: Response) {
  res.send('Do not have required access');
  res.end();
}

///\todo: middleware to ensure only THIS user can affect THIS user (Delete request...)
