import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { Response, NextFunction, Request } from 'express';

export const isSignedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.session!.jwt;
  try {
    if (token) {
      const decoded = jwt.verify(token, config.secret, { maxAge: '7d' });
      console.log(decoded);
      ///\todo: check if blacklisted (blacklist on signout)
      next();
    } else {
      res.send('Do not have required access');
    }
  } catch (err) {
    console.log(err);
    res.send('error encountered. Do not have required access');
    res.end();
  }
};

///\todo: middleware to ensure only THIS user can affect THIS user (Delete request...)
