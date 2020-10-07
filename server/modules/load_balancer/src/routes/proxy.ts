import axios, { Method } from 'axios';
import { Request, Response } from 'express';
import { urlShortenerUrls } from './loadBalancer';

let cur = 0;
export async function proxyHandler(req: Request, res: Response): Promise<void> {
  if (req.path === '/serviceupdate' || req.path === '/ping') {
    return;
  }
  if (cur + 1 > urlShortenerUrls.length) {
    cur = 0;
  }

  try {
    const routeResponse = await axios({
      method: req.method as Method,
      data: req.body,
      url: urlShortenerUrls[cur] + req.url,
      headers: req.headers,
    });

    res.send(routeResponse.data);
  } catch (err) {
    res.send('error');
    console.log(err);
  }
  cur = (cur + 1) % urlShortenerUrls.length;
}
