import jwt from 'jsonwebtoken';
import config from '../config';
import { Response, NextFunction, Request } from 'express';

export const isSignedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.session!.jwt;
  try {
    if (token) {
      const decoded = jwt.verify(token, config.secret, { maxAge: '7d' });
      console.log(decoded);
      ///\todo: check if blacklisted (blacklist on signout)
      next();
    }
  } catch (err) {
    console.log(err);
    res.send('error, do not have required access');
  }
};

///\todo: middleware to ensure only THIS user can affect THIS user (Delete request...)
