import mysql from 'mysql';

export function storeLinkInDb(
  pool: mysql.Pool,
  unencodedId: number,
  shortLink: string,
  longLink: string,
  username: string
): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const linkRow = [username, unencodedId, shortLink, longLink];
    const query = 'INSERT INTO link (user_id, unencoded_id_no_entropy, short_link, long_link) VALUES (?,?,?,?)';
    pool.query(query, linkRow, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}
