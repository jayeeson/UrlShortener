import { asyncQuery } from '../db';
import { User, AccountType } from '../../types';
import config from '../../utils/config';
import { isTokenValid, isTokenOfAccountType } from '../jwt';
import { Request } from 'express';

export async function queryUser(username: string) {
  return await asyncQuery<User>(config.db, 'SELECT * FROM user WHERE username = (?)', [username]);
}

export async function useRequestedAccountTypeIfAdmin(req: Request) {
  const { accountType }: User = req.body;

  if (accountType) {
    const token: string = req.session?.token;
    if ((await isTokenValid(token)) && isTokenOfAccountType(token, AccountType.Admin)) {
      return accountType;
    }
  }

  return AccountType.User;
}
