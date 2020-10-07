import mysql from 'mysql';
export declare function getHighestRange(db: mysql.Connection): Promise<number>;
export declare function getShortLinkRange(db: mysql.Connection): Promise<{
    min: number;
    max: number;
}>;
