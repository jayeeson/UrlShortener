import express from 'express';
import bcrypt from 'bcrypt';
import { sqlQuery, sqlAlter } from '../helpers/db';
import config from '../utils/config';
import { getHashedPassword } from '../helpers/bcrypt';
import { generateJwt, useTokenIfValid } from '../helpers/jwt';
import { isSignedIn } from '../middleware/users';
import { queryUser, useRequestedAccountTypeIfAdmin } from '../helpers/sql/user';
import { insertTokenInBlacklist } from '../helpers/sql/blacklist';
import { User, AccountType } from '../types';

export const router = express.Router();

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
    res.send('User created. Please login.');
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

router.get('/login', (req, res) => {
  res.send('Hit login page');
});

router.post('/login', async (req, res) => {
  const { username, password }: User = req.body;

  if (!username || !password) {
    return res.send('Missing username / password');
  }

  try {
    const user = await queryUser(username);

    if (!user) {
      return res.send(`Username ${username} does not exist`);
    }

    const correctPassword = await bcrypt.compare(password, user[0].password);
    if (correctPassword) {
      const token = generateJwt(username, user[0].accountType);
      if (req.session) {
        req.session.token = token;
      }
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
  if (req.session) {
    const { token } = req.session;
    req.session.token = '';

    try {
      await insertTokenInBlacklist(token);
      res.send('Logged out');
    } catch (err) {
      res.send('Error logging out');
    }
  }
});

router.get('/deleteUser', async (req, res) => {
  if (req.session && req.session.token) {
    const { token } = req.session;
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

router.get('/stuff', isSignedIn, (req, res) => {
  res.send('hit stuff route');
});
