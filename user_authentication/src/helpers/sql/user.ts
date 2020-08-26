import { asyncQuery } from '../db';
import { User } from '../../types';
import config from '../../utils/config';

export async function queryUser(username: string) {
  return await asyncQuery<User>(
    config.db,
    'SELECT * FROM user WHERE username = (?)',
    [username]
  );
}
