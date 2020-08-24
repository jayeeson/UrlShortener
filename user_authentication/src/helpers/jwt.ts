import jwt, { Secret } from 'jsonwebtoken';

export const generateAccessToken = (username: string) => {
  if (process.env.SECRET_TOKEN === undefined) {
    throw Error('missing SECRET_TOKEN environment variable');
  }
  const secret: Secret = process.env.SECRET_TOKEN;
  return jwt.sign(username, secret, {
    expiresIn: '7 days',
  });
};
