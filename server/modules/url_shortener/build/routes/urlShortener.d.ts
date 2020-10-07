import mysql from 'mysql';
export declare const routes: (db: mysql.Connection, minMaxRange: {
    min: number;
    max: number;
}) => import("express-serve-static-core").Router;
