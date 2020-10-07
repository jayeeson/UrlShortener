"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = __importDefault(require("redis"));
var dotenv_1 = __importDefault(require("dotenv"));
var db_1 = require("../helpers/db");
var port_1 = require("../helpers/port");
dotenv_1.default.config();
var argStrings = {
    port: 'port=',
    redisPort: 'redisport=',
};
var coordinatorUrl = (_a = process.env.COORDINATOR_URL_ROOT) !== null && _a !== void 0 ? _a : 'http://localhost:3000';
var hostname = (_b = process.env.HOST) !== null && _b !== void 0 ? _b : 'localhost';
var port = (_c = port_1.getPort(argStrings.port, process.env.PORT)) !== null && _c !== void 0 ? _c : 3007;
var redisPort = (_d = port_1.getPort(argStrings.redisPort, process.env.REDIS_PORT)) !== null && _d !== void 0 ? _d : 6379;
var urlRoot = "http://" + hostname + ":" + port;
if (process.env.SERVICE_NAME === undefined) {
    throw Error('missing SERVICE_NAME environment variable');
}
var serviceData = {
    name: process.env.SERVICE_NAME,
    url: urlRoot,
};
var dbOptions = {
    host: hostname,
    user: (_e = process.env.DBUSER) !== null && _e !== void 0 ? _e : '',
    password: (_f = process.env.DBPASS) !== null && _f !== void 0 ? _f : '',
};
var db;
function connectDatabase() {
    if (!db) {
        db = db_1._dbCreation(dbOptions);
        db_1._dbConnect(db);
        try {
            db_1._seedDB(db);
        }
        catch (err) {
            console.log(err);
        }
    }
    return db;
}
var redisClient = redis_1.default.createClient(redisPort, hostname);
redisClient.on('connect', function () { return console.log("connected to redis on port " + redisPort); });
var serviceNames = {
    userAuthenticator: 'user_authenticator',
};
var dbTrancheSize = 10000;
var exitSignals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
exports.default = {
    argStrings: argStrings,
    coordinatorUrl: coordinatorUrl,
    hostname: hostname,
    port: port,
    redis: {
        host: hostname,
        port: redisPort,
        client: redisClient,
    },
    serviceData: serviceData,
    db: connectDatabase(),
    serviceNames: serviceNames,
    dbTrancheSize: dbTrancheSize,
    exitSignals: exitSignals,
};
//# sourceMappingURL=config.js.map