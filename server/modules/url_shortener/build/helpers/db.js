"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeLinkInDb = exports.exitDb = exports._seedDB = exports._dbConnect = exports._dbCreation = exports.asyncQuery = void 0;
var mysql_1 = __importDefault(require("mysql"));
exports.asyncQuery = function (db, query, args) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                db.query(query, args, function (err, row) {
                    if (err) {
                        reject(err);
                    }
                    resolve(row);
                });
            })];
    });
}); };
// MySQL DB CONNECTION / SETUP
exports._dbCreation = function (options) {
    return mysql_1.default.createConnection(options);
};
exports._dbConnect = function (db) {
    db.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log('connected to MySQL server');
    });
};
function _seedDB(db) {
    return __awaiter(this, void 0, void 0, function () {
        var queries, queryResponses;
        return __generator(this, function (_a) {
            try {
                queries = [
                    'CREATE DATABASE IF NOT EXISTS url_shortener;',
                    'USE url_shortener;',
                    "CREATE TABLE IF NOT EXISTS link (\n          user_id INT(9),\n          short_link VARCHAR(8),\n          long_link VARCHAR(2083)\n        );",
                    "CREATE TABLE IF NOT EXISTS link_analytic ( \n          short_link VARCHAR(8),\n          expiry DATE,\n          count INT(9)\n        );",
                    "CREATE TABLE IF NOT EXISTS counter (\n          highest_unused_id INT(11)\n        );",
                ];
                queryResponses = queries.map(function (query) {
                    exports.asyncQuery(db, query);
                });
                Promise.all(queryResponses).then(function (result) {
                    console.log(result);
                });
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
}
exports._seedDB = _seedDB;
function exitDb(db) {
    if (db) {
        db.end(function (err) {
            if (err) {
                console.log("error: " + err.message);
            }
            console.log('Closed the database connection');
        });
    }
}
exports.exitDb = exitDb;
// db helpers
function storeLinkInDb(db, shortLink, longLink) {
    return new Promise(function (resolve, reject) {
        var linkRow = [0, shortLink, longLink];
        var query = "INSERT INTO link (user_id, short_link, long_link) VALUES (?,?,?)";
        db.query(query, linkRow, function (err, results) {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}
exports.storeLinkInDb = storeLinkInDb;
//# sourceMappingURL=db.js.map