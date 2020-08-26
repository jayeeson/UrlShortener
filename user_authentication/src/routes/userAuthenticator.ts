import express from 'express';
import bcrypt from 'bcrypt';
import { asyncQuery } from '../helpers/db';
import config from '../utils/config';
import { getHashedPassword } from '../helpers/bcrypt';
import { generateJwt } from '../helpers/jwt';
import { isSignedIn } from '../middleware/users';
import { queryUser } from '../helpers/sql/user';
import { insertTokenInBlacklist } from '../helpers/sql/blacklist';

export const router = express.Router();

// HOMEPAGE
router.get('/', (req, res) => {
  res.send('hit the main page of user_authentication');
});

// CREATE USER
router.get('/register', (req, res) => {
  res.send('hit user registration page');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.send('could not create user, missing either username or password');
    return;
  }

  try {
    const hash = await getHashedPassword(password);

    const params = [username, hash];
    await asyncQuery<any>(
      config.db,
      'INSERT INTO user (username, password) VALUES (?,?)',
      params
    );

    console.log(`user ${username} created`);
    res.send('user created. please login.');
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
  const { username, password } = req.body;
  console.log(req.body);

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
      const token = generateJwt(username);
      if (req.session) {
        req.session.token = token;
      }
      console.log(req.session);
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
    req.session.token = null;

    try {
      await insertTokenInBlacklist(token);
      res.send('Logged out');
    } catch (err) {
      res.send('Error logging out');
    }
  }
});

router.get('/deleteUser', async (req, res) => {
  const { username } = req.body;
  try {
    const user = await queryUser(username);

    if (user) {
      await asyncQuery<any>(
        config.db,
        'DELETE FROM user WHERE username = (?)',
        [username]
      );

      if (req.session) {
        const { token } = req.session;
        await insertTokenInBlacklist(token);
      }
    }
  } catch (err) {
    console.log(err);
    res.send('Could not delete user');
  }
});

router.get('/stuff', isSignedIn, (req, res) => {
  res.send('hit stuff route');
});
