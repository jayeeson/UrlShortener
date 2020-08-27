import { asyncQuery } from '../db';
import { User, AccountType } from '../../types';
import config from '../../utils/config';
import { isTokenValid } from '../jwt';
import { Request } from 'express';

export async function queryUser(username: string) {
  return await asyncQuery<User>(config.db, 'SELECT * FROM user WHERE username = (?)', [username]);
}

export async function useRequestedAccountTypeIfAdmin(req: Request) {
  const { accountType }: User = req.body;

  if (accountType) {
    const token: string = req.session?.token;
    if (await isTokenValid(token)) {
      return accountType; // overwrite default with requested option only if currently signed in as admin
    }
  }

  return AccountType.User;
}
