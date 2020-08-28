import { Response, NextFunction, Request } from 'express';
import { isTokenValid } from '../helpers/jwt';

function forbidAccess(res: Response) {
  res.send('Do not have required access');
  res.end();
}

export const isSignedIn = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.session?.token;

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
};

///\todo: middleware to ensure only THIS user can affect THIS user (Delete request...)
