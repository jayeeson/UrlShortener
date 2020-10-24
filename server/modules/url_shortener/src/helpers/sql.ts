import mysql from 'mysql';

export function storeLinkInDb(pool: mysql.Pool, shortLink: string, longLink: string, username: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const linkRow = [username, shortLink, longLink];
    const query = 'INSERT INTO link (user_id, short_link, long_link) VALUES (?,?,?)';
    pool.query(query, linkRow, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}
