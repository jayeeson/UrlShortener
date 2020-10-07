/// <reference types="node" />
import { Server } from 'http';
import mysql from 'mysql';
import { ServiceData } from './types';
export declare const getPort: () => number;
export declare function exitGracefully(server: Server, coordinatorUrl: string, serviceData: ServiceData, db?: mysql.Connection): Promise<void>;
export declare function exitGracefullyOnSignals(signals: NodeJS.Signals[], server: Server, coordinatorUrl: string, serviceData: ServiceData, db?: mysql.Connection): void;
