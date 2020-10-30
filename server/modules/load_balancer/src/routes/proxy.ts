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
  if (serviceUrls[service].length === 0) {
    console.log(`server error: no service of type ${service} is running to handle request to ${req.url}`);
    return res.status(400).send(`server error: no service of type ${service} is running to handle your request`);
  }

  if (index[service] + 1 > serviceUrls[service].length) {
    index[service] = 0;
  }

  console.log('proxying', req.url, 'to', service);
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
      axiosError.response.headers['set-cookie'];
      const proxyCookie = axiosError.response.headers['set-cookie'];

      if (proxyCookie) {
        res.setHeader('set-cookie', proxyCookie);
      }
      return res.status(304).send('previous value');
    }
    res.status(400).send(`error proxying request to ${req.url}`);
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
  if (pathBelongsToService(req, 'loadBalancer')) {
    return;
  } else if (pathBelongsToService(req, 'urlShortener')) {
    handleProxy(req, res, serviceUrls, 'urlShortener');
  } else if (pathBelongsToService(req, 'userAuthenticator')) {
    handleProxy(req, res, serviceUrls, 'userAuthenticator');
  }
}
