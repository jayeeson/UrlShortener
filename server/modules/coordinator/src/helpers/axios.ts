import mysql from 'mysql';
import axios from 'axios';
import { queryActiveServices } from './sql';
import { ServiceNames, UserAuthenticatorUpdate } from '../types';
import { ServiceData } from '../types';

export async function sendServiceUpdateToLoadBalancer(pool: mysql.Pool): Promise<void> {
  try {
    const activeServices = await queryActiveServices(pool);
    const loadBalancer = activeServices.find(service => service.name === ServiceNames.loadBalancer);
    if (loadBalancer) {
      axios.post(`${loadBalancer.url}/serviceupdate`, { services: activeServices }).catch(err => console.log(err));
      console.log('Service update sent to load balancer');
    }
  } catch (err) {
    console.log(err);
  }
}

export async function sendUserAuthenticatorsToUrlShortener(pool: mysql.Pool, urlShortener: ServiceData): Promise<void> {
  try {
    const activeServices = await queryActiveServices(pool);
    const userAuthenticators = activeServices.filter(service => service.name === ServiceNames.userAuthenticator);

    if (userAuthenticators.length > 0) {
      axios
        .post(`${urlShortener.url}/userauthenticator/all`, { userAuthenticators: userAuthenticators })
        .catch(err => console.log(err));
    }
    console.log('All active user authenticators sent to url Shortener');
  } catch (err) {
    console.log(err);
  }
}

export async function sendUserAuthenticatorUpdateToUrlShorteners(
  pool: mysql.Pool,
  userAuthenticatorUpdate: UserAuthenticatorUpdate[]
): Promise<void> {
  try {
    genericSendServiceToAllUrlShorteners(pool, userAuthenticatorUpdate, '/userauthenticator/update');
    console.log('Update to user authenticator sent to all url Shorteners');
  } catch (err) {
    console.log(err);
  }
}

export async function sendUei(serviceData: ServiceData, uei: number): Promise<void> {
  await axios.post(`${serviceData.url}/uei`, { uei });
}

export async function getExpiredServices(services: ServiceData[]): Promise<(ServiceData | null)[]> {
  return Promise.all(
    services.map(async service => {
      try {
        const response = await axios.get<ServiceData>(`${service.url}/ping`);
        if (service.name !== response.data.name) {
          return service;
        }
        return null;
      } catch (err) {
        return service;
      }
    })
  );
}

export async function sendLoadBalancerToUrlShortener(pool: mysql.Pool, serviceData: ServiceData): Promise<void> {
  const activeServices = await queryActiveServices(pool);
  const loadBalancer = activeServices.find(service => service.name === ServiceNames.loadBalancer);

  if (!loadBalancer) {
    return;
  }

  axios.post(`${serviceData.url}/loadbalancer`, { serviceUpdate: loadBalancer });
}

export async function sendLoadBalancerToAllUrlShorteners(
  pool: mysql.Pool,
  loadBalancerData: ServiceData
): Promise<void> {
  try {
    genericSendServiceToAllUrlShorteners(pool, loadBalancerData, '/loadbalancer');
    console.log('Load balancer sent to all url Shorteners');
  } catch (err) {
    console.log(err);
  }
}

export async function genericSendServiceToAllUrlShorteners(
  pool: mysql.Pool,
  update: ServiceData | UserAuthenticatorUpdate[],
  route: string
): Promise<void> {
  try {
    const activeServices = await queryActiveServices(pool);
    const urlShorteners = activeServices.filter(service => service.name === ServiceNames.urlShortener);

    urlShorteners.map(urlShortener => {
      axios.post(`${urlShortener.url + route}`, { serviceUpdate: update }).catch(err => console.log(err));
    });
  } catch (err) {
    console.log(err);
  }
}
