import express from 'express';
import bcrypt from 'bcrypt';
import { asyncQuery } from '../helpers/db';
import config from '../utils/config';
import { getHashedPassword } from '../helpers/bcrypt';
import { User } from '../types';
import { generateJwt } from '../helpers/jwt';
import { isSignedIn } from '../middleware/users';

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

    console.log('user created');
    res.send('user created');
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
  res.send('hit login page');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  if (!username || !password) {
    res.send('missing username / password');
    return;
  }

  try {
    const user = await asyncQuery<User>(
      config.db,
      'SELECT * FROM user WHERE username = (?)',
      [username]
    );

    const correctPassword = await bcrypt.compare(password, user[0].password);
    if (correctPassword) {
      console.log('issue JWT token now!');
      const jwtToken = generateJwt(username);
      if (req.session) {
        req.session.jwt = jwtToken;
      }
      console.log(req.session);
    } else {
      console.log('incorrect password');
    }
    res.send(`login route hit.... result = ${correctPassword}`);
  } catch (err) {
    console.log(err);
    res.send('error logging in');
  }
});

router.get('/logout', async (req, res) => {
  const token = req.session?.jwt;
  if (req.session) {
    req.session.jwt = null;
  }

  try {
    await asyncQuery<any>(
      config.db,
      'INSERT INTO blacklist (token) VALUES (?)',
      [token]
    );
    res.send('logged out');
  } catch (err) {
    res.send('error logging out');
  }
});

router.get('/stuff', isSignedIn, (req, res) => {
  res.send('hit stuff route');
});
