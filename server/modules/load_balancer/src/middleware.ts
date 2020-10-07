import moment from 'moment';
import { Request, Response, NextFunction } from 'express';
import { sqlQuery, sqlAlter } from './helpers/db';
import { OkPacket } from 'mysql';
import { RateLimiterData, IsRequestAllowed } from './types';
import config from './utils/config';

async function insertNewRowForNewIp(req: Request) {
  const timestamp = moment().format();
  const params = [req.ip, 1, timestamp];
  try {
    const insertRow = await sqlAlter<OkPacket>(
      await config.pool,
      'INSERT INTO rate_limiter (ip, frequency, timestamp) VALUES (?,?,?)',
      params,
    );
    if (insertRow.affectedRows > 0) {
      console.log('new ip hit /new, inserting new row');
    }
  } catch (err) {
    console.log(err);
  }
}

async function rateLimitLogic(row: RateLimiterData, req: Request) {
  // check if hit at least 5 times in last 30 sec. reate limit if true
  // check if dt < 30 sec.
  const maxRequestsPer30s = 5;
  const timestamp = moment(row.timestamp);
  const timeNow = moment();
  const dt = timeNow.diff(timestamp) / 1000;

  if (dt < 30) {
    if (row.frequency >= maxRequestsPer30s) {
      return IsRequestAllowed.REQUEST_LIMIT_EXCEEDED;
    } else {
      await sqlAlter<any>(await config.pool, 'UPDATE rate_limiter SET frequency = frequency + 1 WHERE ip = (?)', [
        req.ip,
      ]);
    }
  } else {
    const params = [timeNow.format(), req.ip];
    console.log(timestamp.format());
    await sqlAlter<any>(
      await config.pool,
      'UPDATE rate_limiter SET frequency = 1, timestamp = (?) WHERE ip = (?)',
      params,
    );
  }
  return IsRequestAllowed.YES;
}

export async function rateLimiter(req: Request, res: Response, next: NextFunction): Promise<Response<any> | undefined> {
  const { ip, path } = req;
  if (path !== '/new') {
    next();
    return;
  }
  const ipQuery = await sqlQuery<RateLimiterData>(await config.pool, 'SELECT * FROM rate_limiter WHERE ip = (?)', [ip]);
  if (!ipQuery) {
    insertNewRowForNewIp(req);
  } else {
    const status = await rateLimitLogic(ipQuery[0], req);
    if (status === IsRequestAllowed.REQUEST_LIMIT_EXCEEDED) {
      return res.status(429).send('Too many requests! Please wait a minute before retrying.');
    }
  }
  next();
}
