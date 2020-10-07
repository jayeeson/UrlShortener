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
exports.routes = void 0;
var express_1 = __importDefault(require("express"));
var base_62_1 = __importDefault(require("base-62"));
var db_1 = require("../helpers/db");
var Counter_1 = require("../Counter");
var config_1 = __importDefault(require("../utils/config"));
var router = express_1.default.Router();
function manageReservedRange(nextId, min, max) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, newMin, newMax;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(nextId > max)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Counter_1.getShortLinkRange(config_1.default.db)];
                case 1:
                    _a = _b.sent(), newMin = _a.min, newMax = _a.max;
                    min = newMin;
                    max = newMax;
                    nextId = min;
                    _b.label = 2;
                case 2: return [2 /*return*/, {
                        nextId: nextId,
                        min: min,
                        max: max,
                    }];
            }
        });
    });
}
exports.routes = function (db, minMaxRange) {
    var min = minMaxRange.min, max = minMaxRange.max;
    var nextId = min;
    router.get('/', function (req, res) {
        res.render('index');
    });
    router.post('/new', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var url, urlRegex, nextIdWithEntropy, shortLink, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    url = req.body.url;
                    if (!url) {
                        throw new Error('Missing key "url"');
                    }
                    urlRegex = /(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gi;
                    if (!url.match(urlRegex)) return [3 /*break*/, 2];
                    nextIdWithEntropy = Math.floor((nextId + Math.random()) * 10);
                    console.log("id before encoding = " + nextIdWithEntropy);
                    shortLink = base_62_1.default.encode(nextIdWithEntropy).padStart(8, '0');
                    db_1.storeLinkInDb(db, shortLink, url);
                    nextId += 1;
                    return [4 /*yield*/, manageReservedRange(nextId, min, max)];
                case 1:
                    (_a = _b.sent(), nextId = _a.nextId, min = _a.min, max = _a.max);
                    res.send(shortLink);
                    return [3 /*break*/, 3];
                case 2:
                    res.send('invalid url');
                    _b.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.log(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var shortLink, row, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shortLink = req.params.id;
                    return [4 /*yield*/, db_1.asyncQuery(config_1.default.db, 'SELECT long_link FROM link WHERE short_link = (?)', [shortLink])];
                case 1:
                    row = _a.sent();
                    if (row.length > 0) {
                        url = row[0].long_link;
                        if (url.substr(0, 4) != 'http://') {
                            url = 'http://'.concat(url);
                        }
                        res.send(url);
                    }
                    else {
                        res.status(404).send('error');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    router.delete('/:id', function (req, res) {
        var shortLink = req.params.id;
        db.query('DELETE FROM link WHERE short_link = ?', shortLink, function (err, row) {
            if (err) {
                throw err;
            }
            if (row.affectedRows < 1) {
                res.status(404).send('short link not found');
            }
            else {
                res.status(200).send('deleted');
            }
        });
    });
    return router;
};
//# sourceMappingURL=urlShortener.js.map