import { sqlQuery } from '../db';
import { User, AccountType } from '../../types';
import config from '../../utils/config';
import { isTokenValid, isTokenOfAccountType } from '../jwt';
import { Request } from 'express';

export async function queryUser(username: string): Promise<User[]> {
  return await sqlQuery<User>(await config.pool, 'SELECT * FROM user WHERE username = (?)', [username]);
}

export async function useRequestedAccountTypeIfAdmin(req: Request): Promise<AccountType> {
  const { accountType }: User = req.body;

  if (accountType) {
    const token = req.cookies[config.jwt.cookieName];
    if (token && (await isTokenValid(token)) && isTokenOfAccountType(token, AccountType.Admin)) {
      return accountType;
    }
  }

  return AccountType.User;
}
