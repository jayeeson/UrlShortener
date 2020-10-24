import axios, { AxiosError, Method } from 'axios';
import { Request, Response } from 'express';
import { ServiceUrls } from '../types';
import { serviceUrls } from './loadBalancer';
import config from '../utils/config';

const index = {
  urlShortener: 0,
  userAuthenticator: 0,
};

const handleProxy = async (req: Request, res: Response, urls: ServiceUrls, service: keyof typeof index) => {
  if (index[service] + 1 > serviceUrls[service].length) {
    index[service] = 0;
  }

  console.log('proxying to', service);
  try {
    const routeResponse = await axios({
      method: req.method as Method,
      data: req.body,
      url: urls[service][index[service]] + req.url,
      headers: req.headers,
    });

    const proxyCookie = routeResponse.headers['set-cookie'];
    if (proxyCookie) {
      res.setHeader('set-cookie', proxyCookie);
    }
    res.send(routeResponse.data);
  } catch (err) {
    const axiosError = err as AxiosError;
    // 304 Not Modified
    if (axiosError.response?.status === 304) {
      console.log(axiosError.response.data);
      return res.status(304).send('previous value');
    }
    res.send(`error proxying request to ${req.url}`);
    console.log(err);
  }

  if (urls[service].length > 0) {
    index[service] = (index[service] + 1) % urls[service].length;
  } else {
    index[service] = 0;
  }
};

const pathBelongsToService = (req: Request, service: keyof ServiceUrls) => {
  return config.routes[service].find(route => {
    const routeParts = route.split('/:');
    if (routeParts.length === 1) {
      return req.path === route;
    } else {
      return req.path.startsWith(routeParts[0]);
    }
  });
};

export async function proxyHandler(req: Request, res: Response): Promise<void> {
  console.log('trying to route request to url', req.url);

  if (pathBelongsToService(req, 'loadBalancer')) {
    return;
  } else if (pathBelongsToService(req, 'urlShortener')) {
    handleProxy(req, res, serviceUrls, 'urlShortener');
  } else if (pathBelongsToService(req, 'userAuthenticator')) {
    handleProxy(req, res, serviceUrls, 'userAuthenticator');
  }
}
