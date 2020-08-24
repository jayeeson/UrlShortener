import bcrypt from 'bcrypt';

const saltRounds = 10;

export const getHashedPassword = (password: string) => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};
