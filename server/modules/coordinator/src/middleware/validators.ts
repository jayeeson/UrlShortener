import { Request, NextFunction, Response } from 'express';
import { ServiceData } from '../types';

export function hasServiceData(req: Request, res: Response, next: NextFunction): Response<any> | undefined {
  const serviceData = req.body.serviceData as ServiceData;
  if (!serviceData) {
    return res.status(400).send('missing serviceData key');
  }

  if (!serviceData.url || !serviceData.name) {
    return res.status(400).send('missing url or name key in serviceData parameter');
  }
  next();
}
