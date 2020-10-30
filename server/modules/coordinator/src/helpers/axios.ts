import mysql from 'mysql';
import axios from 'axios';
import { queryActiveServices } from './sql';
import { ServiceNames } from '../types';
import { ServiceData } from '../types';

export async function sendServiceUpdateToLoadBalancer(pool: mysql.Pool): Promise<void> {
  try {
    const activeServices = await queryActiveServices(pool);
    const loadBalancer = activeServices.find(service => service.name === ServiceNames.loadBalancer);
    if (loadBalancer) {
      axios.post(`${loadBalancer.url}/serviceupdate`, { services: activeServices }).catch(err => console.log(err));
    }
  } catch (err) {
    console.log(err);
  }
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
  update: ServiceData,
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

export async function requestLargestReservedIdFromAllActiveUrlShorteners(
  pool: mysql.Pool
): Promise<number | undefined> {
  try {
    const activeServices = await queryActiveServices(pool);
    const urlShorteners = activeServices.filter(service => service.name === ServiceNames.urlShortener);

    const highestReservedIdArray = await Promise.all(
      urlShorteners.map(async urlShortener => {
        const { data }: { data: string } = await axios.get(`${urlShortener.url}/highestactivereservedshortlink`);
        return data === 'undefined' ? undefined : parseInt(data, 10);
      })
    );
    const highestReservedId = highestReservedIdArray.reduce((acc, cur) => {
      if (cur === undefined) return acc;
      if (acc === undefined) return cur;
      return cur > acc ? cur : acc;
    });

    return highestReservedId;
  } catch {
    return undefined;
  }
}

export async function requestLargestReservedIdFromUrlShortenerDatabase(
  urlShortenerUrl: string
): Promise<number | undefined> {
  try {
    const { data }: { data: string } = await axios.get(`${urlShortenerUrl}/highestreservedshortlinkindb`);
    return data === 'undefined' ? undefined : parseInt(data, 10);
  } catch {
    return undefined;
  }
}
