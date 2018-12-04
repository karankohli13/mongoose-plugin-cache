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
var debug_1 = __importDefault(require("debug"));
var pluralize_1 = __importDefault(require("pluralize"));
var createCacheMethods_1 = __importDefault(require("./createCacheMethods"));
var debug = debug_1.default('Mongoose:plugin:cache');
var createCachePlugin = function (_a) {
    var redis = _a.redis, _b = _a.enable, enable = _b === void 0 ? false : _b, _c = _a.additionalCacheKeys, additionalCacheKeys = _c === void 0 ? [] : _c, onCacheMiss = _a.onCacheMiss;
    var context = {
        redis: redis,
        enable: enable,
        additionalCacheKeys: additionalCacheKeys,
        onCacheMiss: onCacheMiss,
    };
    var onSave = function (doc) { return __awaiter(_this, void 0, void 0, function () {
        var model, cacheSet, _i, additionalCacheKeys_1, key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debug('onSave', doc);
                    model = doc.constructor;
                    cacheSet = createCacheMethods_1.default(__assign({}, context, { model: model })).cacheSet;
                    return [4 /*yield*/, cacheSet(doc._id, doc.toObject())];
                case 1:
                    _a.sent();
                    _i = 0, additionalCacheKeys_1 = additionalCacheKeys;
                    _a.label = 2;
                case 2:
                    if (!(_i < additionalCacheKeys_1.length)) return [3 /*break*/, 5];
                    key = additionalCacheKeys_1[_i];
                    return [4 /*yield*/, cacheSet(doc[key], doc.toObject())];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var onRemove = function (doc) { return __awaiter(_this, void 0, void 0, function () {
        var model, cacheClear, _i, additionalCacheKeys_2, key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debug('onRemove', doc);
                    if (!doc) {
                        return [2 /*return*/];
                    }
                    model = doc.constructor;
                    cacheClear = createCacheMethods_1.default(__assign({}, context, { model: model })).cacheClear;
                    return [4 /*yield*/, cacheClear(doc._id)];
                case 1:
                    _a.sent();
                    _i = 0, additionalCacheKeys_2 = additionalCacheKeys;
                    _a.label = 2;
                case 2:
                    if (!(_i < additionalCacheKeys_2.length)) return [3 /*break*/, 5];
                    key = additionalCacheKeys_2[_i];
                    return [4 /*yield*/, cacheClear(doc[key])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var MONGOOSE_CREATE_OR_UPDATE_METHODS = ['save', 'findOneAndUpdate'];
    var MONGOOSE_REMOVE_METHODS = ['findOneAndRemove', 'findOneAndDelete'];
    return function (schema) {
        MONGOOSE_CREATE_OR_UPDATE_METHODS.forEach(function (methodName) {
            schema.post(methodName, onSave);
        });
        // This method sends a remove command directly to MongoDB, no Mongoose documents are involved. Because no Mongoose documents are involved, no middleware (hooks) are executed.
        MONGOOSE_REMOVE_METHODS.forEach(function (methodName) {
            schema.post(methodName, onRemove);
        });
        schema.statics.clear = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheClear;
                return __generator(this, function (_a) {
                    cacheClear = createCacheMethods_1.default(__assign({}, context, { model: this })).cacheClear;
                    return [2 /*return*/, cacheClear(key)];
                });
            });
        };
        schema.statics.clearMany = function (keys) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheClearMany;
                return __generator(this, function (_a) {
                    cacheClearMany = createCacheMethods_1.default(__assign({}, context, { model: this })).cacheClearMany;
                    return [2 /*return*/, cacheClearMany(keys)];
                });
            });
        };
        schema.statics.get = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, cacheGet, cacheGetMany;
                return __generator(this, function (_b) {
                    _a = createCacheMethods_1.default(__assign({}, context, { model: this })), cacheGet = _a.cacheGet, cacheGetMany = _a.cacheGetMany;
                    if (Array.isArray(key)) {
                        return [2 /*return*/, cacheGetMany(key)];
                    }
                    return [2 /*return*/, cacheGet(key)];
                });
            });
        };
        schema.statics.getBy = function (cacheKey, key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, cacheGetBy, cacheGetManyBy;
                return __generator(this, function (_b) {
                    _a = createCacheMethods_1.default(__assign({}, context, { model: this })), cacheGetBy = _a.cacheGetBy, cacheGetManyBy = _a.cacheGetManyBy;
                    if (Array.isArray(key)) {
                        return [2 /*return*/, cacheGetManyBy(cacheKey, key)];
                    }
                    return [2 /*return*/, cacheGetBy(cacheKey, key)];
                });
            });
        };
        schema.statics.getMany = function (keys) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheGetMany;
                return __generator(this, function (_a) {
                    cacheGetMany = createCacheMethods_1.default(__assign({}, context, { model: this })).cacheGetMany;
                    return [2 /*return*/, cacheGetMany(keys)];
                });
            });
        };
        schema.statics.getManyBy = function (cacheKey, keys) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheGetManyBy;
                return __generator(this, function (_a) {
                    cacheGetManyBy = createCacheMethods_1.default(__assign({}, context, { model: this })).cacheGetManyBy;
                    return [2 /*return*/, cacheGetManyBy(cacheKey, keys)];
                });
            });
        };
        additionalCacheKeys.forEach(function (cacheKey) {
            var capitalized = cacheKey.charAt(0).toUpperCase() + cacheKey.substr(1);
            schema.statics["getBy" + capitalized] = function (key) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, cacheGetBy, cacheGetManyBy;
                    return __generator(this, function (_b) {
                        _a = createCacheMethods_1.default(__assign({}, context, { model: this })), cacheGetBy = _a.cacheGetBy, cacheGetManyBy = _a.cacheGetManyBy;
                        if (Array.isArray(key)) {
                            return [2 /*return*/, cacheGetManyBy(cacheKey, key)];
                        }
                        return [2 /*return*/, cacheGetBy(cacheKey, key)];
                    });
                });
            };
            schema.statics["getBy" + pluralize_1.default(capitalized)] = function (keys) {
                return __awaiter(this, void 0, void 0, function () {
                    var cacheGetManyBy;
                    return __generator(this, function (_a) {
                        cacheGetManyBy = createCacheMethods_1.default(__assign({}, context, { model: this })).cacheGetManyBy;
                        return [2 /*return*/, cacheGetManyBy(cacheKey, keys)];
                    });
                });
            };
        });
    };
};
exports.default = createCachePlugin;
//# sourceMappingURL=index.js.map