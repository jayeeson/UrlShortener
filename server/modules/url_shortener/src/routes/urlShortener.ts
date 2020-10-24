import express, { Router } from 'express';
import base62 from 'base-62';
import { OkPacket } from 'mysql';

import { sqlQuery, sqlAlter } from '../helpers/db';
import { getShortLinkRange } from '../Counter';
import config from '../utils/config';
import { storeLinkInDb } from '../helpers/sql';
import mw from '../middleware';
import { getUsernameFromCookie } from '../helpers/cookies';
import { isTokenBlacklisted, verifyToken } from '../helpers/jwt';

const router = express.Router();

async function manageReservedRange(nextId: number, min: number, max: number) {
  if (nextId > max) {
    // reserved range depleted. Get new range from Counter.
    const { min: newMin, max: newMax } = await getShortLinkRange();
    min = newMin;
    max = newMax;
    nextId = min;
  }
  return {
    nextId,
    min,
    max,
  };
}

export const routes = (minMaxRange: { min: number; max: number }): Router => {
  let { min, max } = minMaxRange;
  let nextId = min;

  router.get('/', (req, res) => {
    res.render('index');
  });

  router.post('/new', mw.useAuthTokenOrGuestToken, async (req, res) => {
    try {
      // validate user input: need a long link.
      const { url } = req.body;
      if (!url) {
        throw new Error('Missing key "url"');
      }
      const urlRegex = /(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gi;
      if (url.match(urlRegex)) {
        const username = getUsernameFromCookie(req);
        const nextIdWithEntropy = Math.floor((nextId + Math.random()) * 10);
        console.log(`id before encoding = ${nextIdWithEntropy}`);
        const shortLink = (base62.encode(nextIdWithEntropy) as string).padStart(8, '0');
        storeLinkInDb(await config.pool, shortLink, url, username ?? '0');
        nextId += 1;
        ({ nextId, min, max } = await manageReservedRange(nextId, min, max));
        res.send(shortLink);
      } else {
        res.send('invalid url');
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/link/:id', async (req, res) => {
    const shortLink = req.params.id;
    const row = await sqlQuery<any>(await config.pool, 'SELECT long_link FROM link WHERE short_link = (?)', [
      shortLink,
    ]);
    if (row.length > 0) {
      console.log(row);
      let url: string = row[0].long_link;
      if (url.substr(0, 4) != 'http') {
        url = 'http://'.concat(url);
      }
      // res.send(url);
      res.writeHead(301, { Location: url });
      res.end();
    } else {
      res.status(404).send('error getting link');
    }
  });

  router.delete('/link/:id', async (req, res) => {
    console.log('hit delete route');

    const shortLink = req.params.id;
    try {
      const row = await sqlAlter<OkPacket>(await config.pool, 'DELETE FROM link WHERE short_link = ?', [shortLink]);
      if (row.affectedRows < 1) {
        res.status(404).send('short link not found');
      } else {
        res.status(200).send('deleted');
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.get('/userlinks', async (req, res) => {
    console.log('start of userlinks route');

    const token = req.cookies[config.jwt.cookieName] || req.cookies[config.jwt.guestCookie];
    const blacklisted = await isTokenBlacklisted(token);
    if (!blacklisted) {
      const decoded = verifyToken(token);
      if (decoded) {
        try {
          const links = await sqlQuery<any>(
            await config.pool,
            'SELECT short_link, long_link FROM link WHERE user_id = (?)',
            [decoded.username]
          );
          return res.send(links);
        } catch (err) {
          console.log(err);
          console.log("couldn't retrieve links for user", decoded.username);
          res.send("error retrieving users' links");
        }
      }
    }
    return res.send([]);
  });

  return router;
};
