import express from 'express';
import base62 from 'base-62';
import { OkPacket } from 'mysql';

import { sqlQuery, sqlAlter } from '../helpers/db';
import config from '../utils/config';
import { storeLinkInDb } from '../helpers/sql';
import mw from '../middleware';
import { getUsernameFromCookie } from '../helpers/cookies';
import { isTokenBlacklisted, verifyToken } from '../helpers/jwt';
import axios from 'axios';

let minReservedId: number | undefined, maxReservedId: number | undefined, nextId: number | undefined;

export const router = express.Router();

export async function getNewShortlinkReservedIdRange(): Promise<void> {
  try {
    const { data }: { data: undefined | { start: number; end: number } } = await axios.get(
      `${process.env.COORDINATOR_URL_ROOT}/shortlinkrange`,
      {
        headers: {
          Referer: `${config.serviceData.url}`,
        },
      }
    );

    if (data === undefined) {
      throw new Error('Could not reserve shortlink range');
    }

    minReservedId = data.start;
    maxReservedId = data.end;
    nextId = minReservedId;
  } catch {
    console.log('caught');

    throw new Error('Could not reserve shortlink range');
  }
}

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/new', mw.useAuthTokenOrGuestToken, async (req, res) => {
  try {
    ///\todo: move validation to middleware. validate user input: need a long link.
    const { url } = req.body;
    if (!url) {
      throw new Error('Missing key "url"');
    }

    if (typeof nextId !== 'number' || typeof maxReservedId !== 'number') {
      try {
        await getNewShortlinkReservedIdRange();
        if (!nextId || !maxReservedId) return res.status(400).send('error, unable to create shortlink');
      } catch {
        return res.status(400).send('error, unable to create shortlink');
      }
    }

    const urlRegex = /(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gi;
    if (url.match(urlRegex)) {
      const username = await getUsernameFromCookie(req);
      const nextIdWithEntropy = Math.floor((nextId + Math.random()) * 10);
      const shortLink = (base62.encode(nextIdWithEntropy) as string).padStart(8, '0');
      storeLinkInDb(await config.pool, nextId, shortLink, url, username ?? '0');
      console.log('created new shortlink', shortLink);
      res.send(shortLink);

      nextId += 1;
      if (nextId > maxReservedId) {
        await getNewShortlinkReservedIdRange();
      }
    } else {
      res.send('invalid url');
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/link/:id', async (req, res) => {
  const shortLink = req.params.id;
  const row = await sqlQuery<any>(await config.pool, 'SELECT long_link FROM link WHERE short_link = (?)', [shortLink]);
  if (row.length > 0) {
    console.log(row);
    let url: string = row[0].long_link;
    if (url.substr(0, 4) != 'http') {
      url = 'http://'.concat(url);
    }
    res.send(url);
  } else {
    res.status(404).send('error getting link');
  }
});

router.delete('/link/:id', async (req, res) => {
  ///\todo: add middleware to ensure only creator of link can delete
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
  const token = req.cookies[config.jwt.cookieName] || req.cookies[config.jwt.guestCookie];
  const blacklisted = await isTokenBlacklisted(token);
  if (!blacklisted) {
    const decoded = await verifyToken(token);
    if (decoded) {
      try {
        const links = await sqlQuery<{ short_link: string; long_link: string }>(
          await config.pool,
          'SELECT short_link, long_link FROM link WHERE user_id = (?)',
          [decoded.username]
        );
        return res.send(links);
      } catch (err) {
        console.log(err);
        console.log("couldn't retrieve links for user", decoded.username);
        res.status(400).send("error retrieving users' links");
      }
    }
  }
  return res.send([]);
});

router.get('/highestactivereservedshortlink', (req, res) => {
  if (maxReservedId) {
    return res.send(maxReservedId.toString());
  }
  return res.send('undefined');
});

router.get('/highestreservedshortlinkindb', async (req, res) => {
  const result = await sqlQuery<{ unencoded_id_no_entropy: string }>(
    await config.pool,
    'SELECT unencoded_id_no_entropy FROM link WHERE unencoded_id_no_entropy=(SELECT MAX(unencoded_id_no_entropy) FROM link)'
  );
  if (result.length) {
    return res.send(result[0].unencoded_id_no_entropy.toString());
  }
  return res.send('undefined');
});
