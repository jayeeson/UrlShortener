/// <reference types="node" />
import { Server } from 'http';
export declare function exitGracefully(server: Server, code: NodeJS.Signals): Promise<void>;
export declare function exitGracefullyOnSignals(signals: NodeJS.Signals[], server: Server): void;
