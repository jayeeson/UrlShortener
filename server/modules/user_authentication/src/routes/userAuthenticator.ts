import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { sqlQuery, sqlAlter } from '../helpers/db';
import config from '../utils/config';
import { getHashedPassword } from '../helpers/bcrypt';
import { generateJwt, ifCookieTokenValidSendResponseString, useTokenIfValid } from '../helpers/jwt';
import { isSignedIn } from '../middleware/users';
import { queryUser, useRequestedAccountTypeIfAdmin } from '../helpers/sql/user';
import { insertTokenInBlacklist, isTokenBlacklisted } from '../helpers/sql/blacklist';
import { User, AccountType } from '../types';

export const router = express.Router();
const oneYearInMs = 31.536e9;

router.get('/', (req, res) => {
  res.send('Hit the main page of user_authentication');
});

router.get('/register', (req, res) => {
  res.send('Hit user registration page');
});

router.post('/register', async (req, res) => {
  const { username, password }: User = req.body;
  if (!username || !password) {
    res.send('Could not create user, missing either username or password');
    return;
  }

  try {
    const hash = await getHashedPassword(password);
    const insertAccountType = await useRequestedAccountTypeIfAdmin(req);
    const params = [username, hash, insertAccountType];

    await sqlAlter<any>(await config.pool, 'INSERT INTO user (username, password, accountType) VALUES (?,?,?)', params);

    console.log(`user ${username} created`);
    res.send('User created.');
  } catch (err) {
    console.log(err);
    let message = '';

    if (err.code && err.code === 'ER_DUP_ENTRY') {
      message += 'That username is already taken. Please choose another.';
    } else {
      message += 'Could not create user';
    }
    res.send(message);
  }
});

router.post('/login', async (req, res) => {
  const { username, password }: User = req.body;

  if (!username || !password) {
    return res.send('Missing username / password');
  }

  try {
    const user = await queryUser(username);

    if (!user.length) {
      return res.send(`Username ${username} does not exist`);
    }

    const correctPassword = await bcrypt.compare(password, user[0].password);
    if (correctPassword) {
      const token = generateJwt(username, user[0].accountType);
      res.cookie(config.jwt.cookieName, token, {
        maxAge: oneYearInMs,
        httpOnly: true,
      });
    } else {
      return res.send('Incorrect password');
    }
    res.send(`Now logged in as ${username}`);
  } catch (err) {
    console.log(err);
    res.send('Error logging in');
  }
});

router.get('/logout', async (req, res) => {
  const cookie = req.cookies[config.jwt.cookieName];

  if (cookie) {
    try {
      await insertTokenInBlacklist(cookie);
      res.clearCookie(config.jwt.cookieName, {
        maxAge: oneYearInMs,
        httpOnly: true,
      });

      res.send('Logged out');
    } catch (err) {
      res.send('Error logging out');
      console.log(err);
    }
  }
});

router.get('/deleteUser', async (req, res) => {
  const token = req.cookies[config.jwt.cookieName];
  if (token) {
    const decoded = await useTokenIfValid(token);
    if (decoded) {
      const { username } = req.body;
      if (username !== decoded.username && decoded.accountType !== AccountType.Admin) {
        return res.send('Do not have privileges to delete another user');
      }
      try {
        const user = await queryUser(username);

        if (user) {
          await sqlQuery<any>(await config.pool, 'DELETE FROM user WHERE username = (?)', [username]);
          await insertTokenInBlacklist(token);
        }
        res.send(`User ${username} deleted`);
      } catch (err) {
        console.log(err);
        res.send('Could not delete user');
      }
    }
  } else {
    res.send('Do not have privileges to delete another user');
  }
});

///\todo: remove this route
router.get('/state', isSignedIn, (req, res) => {
  res.send('hit stuff route');
});

router.get('/jwt/key', (req, res) => {
  res.send(config.secret.publicKey.toString());
});

router.post('/jwt/blacklisted', async (req, res) => {
  const isBlacklisted = await isTokenBlacklisted(req.body.token);
  res.send(isBlacklisted);
});

router.get('/jwt/guest', async (req, res) => {
  const uuid = uuidv4();
  const token = generateJwt(uuid, AccountType.Guest, '365d');
  res.cookie(config.jwt.guestCookie, token, {
    maxAge: oneYearInMs,
    httpOnly: true,
  });
  res.send();
});

router.get('/jwt/status', async (req, res) => {
  const userResponseSent = ifCookieTokenValidSendResponseString(req, res, config.jwt.cookieName, 'user token');
  if (!userResponseSent) {
    const guestResponseSent = ifCookieTokenValidSendResponseString(req, res, config.jwt.guestCookie, 'guest token');
    if (!guestResponseSent) {
      return res.status(200).send('no token');
    }
  }
});
