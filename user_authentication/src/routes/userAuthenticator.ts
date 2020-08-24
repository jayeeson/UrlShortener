import express from 'express';
import bcrypt from 'bcrypt';
import { asyncQuery } from '../helpers/dbHelpers';
import config from '../config';
import { getHashedPassword } from '../helpers/bcryptHelpers';
import { User } from '../types';
import { generateAccessToken } from '../helpers/jwt';

export const router = express.Router();

// HOMEPAGE
router.get('/', (req, res) => {
  res.send('hit the main page of user_authentication');
});

// CREATE USER
router.post('/create', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.send('could not create user, missing either username or password');
    return;
  }

  try {
    const hash = await getHashedPassword(password);

    const params = [username, hash];
    const row = await asyncQuery(
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

router.get('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);

  if (!username || !password) {
    res.send('missing username / password');
    return;
  }

  try {
    const user: User[] = await asyncQuery(
      config.db,
      'SELECT * FROM user WHERE username = (?)',
      [username]
    );

    const correctPassword = await bcrypt.compare(password, user[0].password);
    if (correctPassword) {
      console.log('issue JWT token now!');
      const jwtToken = generateAccessToken(username);
      console.log(jwtToken);
    } else {
      console.log('incorrect password');
    }
    res.send(`login route hit.... result = ${correctPassword}`);
  } catch (err) {
    console.log(err);
    res.send('error logging in');
  }
});
