"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_keyby_1 = __importDefault(require("lodash.keyby"));
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('Mongoose:plugin:cache');
var createCacheMethods = function (_a) {
    var enable = _a.enable, _b = _a.additionalCacheKeys, additionalCacheKeys = _b === void 0 ? [] : _b, model = _a.model, redis = _a.redis, onCacheMiss = _a.onCacheMiss, onDataMiss = _a.onDataMiss;
    var name = model.modelName;
    var withCachePrefix = function (key) {
        return name.toLowerCase() + ":" + key;
    };
    var onBatchCacheMiss = function (keys) {
        keys.forEach(function (key) {
            debug('onCacheMiss', key);
            if (onCacheMiss) {
                onCacheMiss(name, key);
            }
        });
    };
    var onBatchDataMiss = function (keys) {
        keys.forEach(function (key) {
            debug('onDataMiss', key);
            if (onDataMiss) {
                onDataMiss(name, key);
            }
        });
    };
    var getManyBy = function (queryKey, keys) { return __awaiter(_this, void 0, void 0, function () {
        var _a, keyLookup, docs, valueByKey;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    keyLookup = queryKey === 'id' ? '_id' : queryKey;
                    return [4 /*yield*/, model.find((_a = {},
                            _a[keyLookup] = {
                                $in: keys,
                            },
                            _a))];
                case 1:
                    docs = _b.sent();
                    valueByKey = lodash_keyby_1.default(docs, queryKey);
                    return [2 /*return*/, keys.map(function (key) {
                            var value = valueByKey[key];
                            if (!value) {
                                onBatchDataMiss([key]);
                                return null;
                            }
                            return value.toObject();
                        })];
            }
        });
    }); };
    var getBy = function (queryKey, key) { return __awaiter(_this, void 0, void 0, function () {
        var value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getManyBy(queryKey, [key])];
                case 1:
                    value = (_a.sent())[0];
                    return [2 /*return*/, value];
            }
        });
    }); };
    var cacheSetMany = function (entries) { return __awaiter(_this, void 0, void 0, function () {
        var batch;
        return __generator(this, function (_a) {
            if (!enable) {
                return [2 /*return*/];
            }
            batch = entries.reduce(function (operations, _a) {
                var key = _a[0], value = _a[1];
                if (!value) {
                    return operations;
                }
                operations.push(['set', withCachePrefix(key), JSON.stringify(value)]);
                return operations;
            }, []);
            if (batch.length === 0) {
                return [2 /*return*/];
            }
            return [2 /*return*/, redis.multi(batch).execAsync()];
        });
    }); };
    var cacheSet = function (key, value) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cacheSetMany([[key, value]])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var cacheGetManyBy = function (cacheKey, keys) {
        if (cacheKey === void 0) { cacheKey = '_id'; }
        return __awaiter(_this, void 0, void 0, function () {
            var batchGet, cachedData, cachedKeyValue, missedKeysFromCache, storedData, storedDataEntries, storedKeyValue, responseKeyValue_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!enable) {
                            return [2 /*return*/, getManyBy(cacheKey, keys)];
                        }
                        batchGet = keys.map(function (key) { return ['get', withCachePrefix(key)]; });
                        return [4 /*yield*/, redis.multi(batchGet).execAsync()];
                    case 1:
                        cachedData = _a.sent();
                        cachedKeyValue = keys.reduce(function (total, key, index) {
                            var doc = cachedData[index];
                            if (doc) {
                                total[key] = JSON.parse(doc);
                            }
                            return total;
                        }, {});
                        missedKeysFromCache = keys.filter(function (key) { return !cachedKeyValue[key]; });
                        if (!(missedKeysFromCache.length > 0)) return [3 /*break*/, 4];
                        onBatchCacheMiss(missedKeysFromCache);
                        return [4 /*yield*/, getManyBy(cacheKey, missedKeysFromCache)];
                    case 2:
                        storedData = _a.sent();
                        storedDataEntries = Object.entries(lodash_keyby_1.default(storedData.filter(function (item) { return !!item; }), cacheKey));
                        storedKeyValue = storedDataEntries.reduce(function (total, _a) {
                            var key = _a[0], value = _a[1];
                            if (value) {
                                total[key] = value;
                                // cache optional additional key by option field additionalCacheKeys
                                additionalCacheKeys.forEach(function (additionalCacheKey) {
                                    total[value[additionalCacheKey]] = value;
                                });
                            }
                            return total;
                        }, {});
                        return [4 /*yield*/, cacheSetMany(Object.entries(storedKeyValue))];
                    case 3:
                        _a.sent();
                        responseKeyValue_1 = __assign({}, cachedKeyValue, storedKeyValue);
                        return [2 /*return*/, keys.map(function (key) { return responseKeyValue_1[key] || null; })];
                    case 4: return [2 /*return*/, keys.map(function (key) { return cachedKeyValue[key] || null; })];
                }
            });
        });
    };
    var cacheGetBy = function (cacheKey, key) { return __awaiter(_this, void 0, void 0, function () {
        var value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cacheGetManyBy(cacheKey, [key])];
                case 1:
                    value = (_a.sent())[0];
                    return [2 /*return*/, value];
            }
        });
    }); };
    var cacheGetMany = function (keys) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, cacheGetManyBy('_id', keys)];
    }); }); };
    var cacheGet = function (key) { return cacheGetBy('_id', key); };
    var cacheClearMany = function (keys) { return __awaiter(_this, void 0, void 0, function () {
        var batch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    batch = keys.map(function (key) { return ['del', withCachePrefix(key)]; });
                    return [4 /*yield*/, redis.multi(batch).execAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var cacheClear = function (key) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cacheClearMany([key])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        withCachePrefix: withCachePrefix,
        onBatchCacheMiss: onBatchCacheMiss,
        onBatchDataMiss: onBatchDataMiss,
        getManyBy: getManyBy,
        getBy: getBy,
        cacheSet: cacheSet,
        cacheSetMany: cacheSetMany,
        cacheGet: cacheGet,
        cacheGetBy: cacheGetBy,
        cacheGetMany: cacheGetMany,
        cacheGetManyBy: cacheGetManyBy,
        cacheClear: cacheClear,
        cacheClearMany: cacheClearMany,
    };
};
exports.default = createCacheMethods;
//# sourceMappingURL=createCacheMethods.js.map