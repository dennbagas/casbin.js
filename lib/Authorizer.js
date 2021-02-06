"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Authorizer = void 0;
var axios_1 = __importDefault(require("axios"));
var casbin = __importStar(require("casbin"));
var Permission_1 = __importDefault(require("./Permission"));
var Cache = __importStar(require("./Cache"));
var Authorizer = /** @class */ (function () {
    /**
     *
     * @param mode "auto", "cookies" or "manual"
     * "auto": Specify the casbin server endpoint, and Casbin.js will load permission from it when the identity changes
     * "cookies": Casbin.js load the permission data from the cookie "access_perm" or the specified cookie key.
     * "manual": Load the permission mannually with "setPermission"
     * @param args.endpoint Casbin service endpoint, REQUIRED when mode == "auto"
     * @param args.cacheExpiredTime The expired time of local cache, Unit: seconds, Default: 60s, activated when mode == "auto"
     * @param args.cookieKey The cookie key when loading permission, activated when mode == "cookies"
     */
    function Authorizer(mode, args) {
        if (mode === void 0) { mode = "manual"; }
        if (args === void 0) { args = {}; }
        this.endpoint = undefined;
        this.cookieKey = undefined;
        this.cacheExpiredTime = 60; // Seconds
        if (mode == 'auto') {
            if (!args.endpoint) {
                throw new Error("Specify the endpoint when initializing casbin.js with mode == 'auto'");
            }
            else {
                this.mode = mode;
                this.endpoint = args.endpoint;
                if (args.cacheExpiredTime !== null && args.cacheExpiredTime !== undefined) {
                    this.cacheExpiredTime = args.cacheExpiredTime;
                }
            }
        }
        else if (mode == 'cookies') {
            throw Error("Cookie mode not implemented.");
            /*
            this.mode = mode;
            const permission = Cookies.get(args.cookieKey ? args.cookieKey : "access_perm");
            if (permission) {
                this.setPermission(permission);
            } else {
                console.log("WARNING: No specified cookies");
            }
            */
        }
        else if (mode == 'manual') {
            this.mode = mode;
        }
        else {
            throw new Error("Casbin.js mode can only be one of the 'auto', 'cookies' and 'manual'");
        }
    }
    /**
     * Get the permission.
     */
    Authorizer.prototype.getPermission = function () {
        var _a;
        if (this.permission !== undefined) {
            return (_a = this.permission) === null || _a === void 0 ? void 0 : _a.getPermissionJsonObject();
        }
        else {
            throw Error("Permission is not defined. Are you using manual mode and have set the permission?");
            return {};
        }
    };
    Authorizer.prototype.setPermission = function (permission) {
        if (this.permission === undefined) {
            this.permission = new Permission_1.default();
        }
        this.permission.load(permission);
    };
    Authorizer.prototype.initEnforcer = function (s) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, m, _a, _i, _b, sArray;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        obj = JSON.parse(s);
                        if (!('m' in obj)) {
                            throw Error("No model when init enforcer.");
                        }
                        m = casbin.newModelFromString(obj['m']);
                        _a = this;
                        return [4 /*yield*/, casbin.newEnforcer(m)];
                    case 1:
                        _a.enforcer = _c.sent();
                        if (!('p' in obj)) return [3 /*break*/, 5];
                        _i = 0, _b = obj['p'];
                        _c.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3 /*break*/, 5];
                        sArray = _b[_i];
                        return [4 /*yield*/, this.enforcer.addPolicy(sArray[1].trim(), sArray[2].trim(), sArray[3].trim())];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initialize the enforcer
     */
    Authorizer.prototype.getEnforcerDataFromSvr = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.endpoint === undefined || this.endpoint === null) {
                            throw Error("Endpoint is null or not specified.");
                        }
                        return [4 /*yield*/, axios_1.default.get(this.endpoint + "?subject=" + this.user)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp.data.data];
                }
            });
        });
    };
    /**
     * Set the user subject for the authroizer
     * @param user The current user
     */
    Authorizer.prototype.setUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.mode == 'auto' && user !== this.user)) return [3 /*break*/, 4];
                        this.user = user;
                        config = Cache.loadFromLocalStorage(user);
                        if (!(config === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getEnforcerDataFromSvr()];
                    case 1:
                        config = _a.sent();
                        Cache.saveToLocalStorage(user, config, this.cacheExpiredTime);
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.initEnforcer(config)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Authorizer.prototype.can = function (action, object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.mode == "manual")) return [3 /*break*/, 1];
                        return [2 /*return*/, this.permission !== undefined && this.permission.check(action, object)];
                    case 1:
                        if (!(this.mode == "auto")) return [3 /*break*/, 5];
                        if (!(this.enforcer === undefined)) return [3 /*break*/, 2];
                        throw Error("Enforcer not initialized");
                    case 2: return [4 /*yield*/, this.enforcer.enforce(this.user, object, action)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5: throw Error("Mode " + this.mode + " not recognized.");
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Authorizer.prototype.cannot = function (action, object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.can(action, object)];
                    case 1: return [2 /*return*/, !(_a.sent())];
                }
            });
        });
    };
    Authorizer.prototype.canAll = function (action, objects) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < objects.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cannot(action, objects[i])];
                    case 2:
                        if (_a.sent()) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    Authorizer.prototype.canAny = function (action, objects) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < objects.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.can(action, objects[i])];
                    case 2:
                        if (_a.sent()) {
                            return [2 /*return*/, true];
                        }
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    return Authorizer;
}());
exports.Authorizer = Authorizer;
