var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
System.register("after.init", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function afterInit(app, showErrors) {
        return function () {
            app.use(function (err, req, res, next) {
                if (!err)
                    return;
                if (res.headersSent)
                    return;
                if (typeof err === "string") {
                    res.status(404).send({
                        error: err,
                        status: 404
                    });
                    return;
                }
                if (Array.isArray(err) && err.length === 2) {
                    if (typeof err[0] === "number") {
                        res.status(err[0]).send({
                            error: err[1],
                            status: err[0]
                        });
                        return;
                    }
                }
                if (showErrors) {
                    res.status(err.statusCode || 500).send({
                        error: err.message || err,
                        type: "unhandled",
                        status: err.statusCode || 404
                    });
                    return;
                }
                console.error('\x1b[31m', err);
                res.status(err.statusCode || 404).send({
                    error: "Server error",
                    status: err.statusCode || 404
                });
            });
            app.use(function (req, res, next) {
                res.status(404).send({
                    error: "API not found",
                    'api-path': req.url,
                    status: 404
                });
            });
        };
    }
    exports_1("default", afterInit);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("express2/exceptions", [], function (exports_2, context_2) {
    "use strict";
    var HttpException, NotAuthException, HttpStatus;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            HttpException = (function (_super) {
                __extends(HttpException, _super);
                function HttpException(response, status) {
                    if (status === void 0) { status = HttpStatus.BAD_REQUEST; }
                    var _this = _super.call(this, response) || this;
                    _this.status = status;
                    Object.setPrototypeOf(_this, HttpException.prototype);
                    return _this;
                }
                return HttpException;
            }(Error));
            exports_2("HttpException", HttpException);
            NotAuthException = (function (_super) {
                __extends(NotAuthException, _super);
                function NotAuthException() {
                    return _super.call(this, "NO_AUTH", HttpStatus.UNAUTHORIZED) || this;
                }
                return NotAuthException;
            }(HttpException));
            exports_2("NotAuthException", NotAuthException);
            (function (HttpStatus) {
                HttpStatus[HttpStatus["CONTINUE"] = 100] = "CONTINUE";
                HttpStatus[HttpStatus["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
                HttpStatus[HttpStatus["PROCESSING"] = 102] = "PROCESSING";
                HttpStatus[HttpStatus["EARLYHINTS"] = 103] = "EARLYHINTS";
                HttpStatus[HttpStatus["OK"] = 200] = "OK";
                HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
                HttpStatus[HttpStatus["ACCEPTED"] = 202] = "ACCEPTED";
                HttpStatus[HttpStatus["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
                HttpStatus[HttpStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
                HttpStatus[HttpStatus["RESET_CONTENT"] = 205] = "RESET_CONTENT";
                HttpStatus[HttpStatus["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
                HttpStatus[HttpStatus["AMBIGUOUS"] = 300] = "AMBIGUOUS";
                HttpStatus[HttpStatus["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
                HttpStatus[HttpStatus["FOUND"] = 302] = "FOUND";
                HttpStatus[HttpStatus["SEE_OTHER"] = 303] = "SEE_OTHER";
                HttpStatus[HttpStatus["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
                HttpStatus[HttpStatus["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
                HttpStatus[HttpStatus["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
                HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
                HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
                HttpStatus[HttpStatus["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
                HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
                HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
                HttpStatus[HttpStatus["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
                HttpStatus[HttpStatus["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
                HttpStatus[HttpStatus["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
                HttpStatus[HttpStatus["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
                HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
                HttpStatus[HttpStatus["GONE"] = 410] = "GONE";
                HttpStatus[HttpStatus["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
                HttpStatus[HttpStatus["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
                HttpStatus[HttpStatus["PAYLOAD_TOO_LARGE"] = 413] = "PAYLOAD_TOO_LARGE";
                HttpStatus[HttpStatus["URI_TOO_LONG"] = 414] = "URI_TOO_LONG";
                HttpStatus[HttpStatus["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
                HttpStatus[HttpStatus["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
                HttpStatus[HttpStatus["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
                HttpStatus[HttpStatus["I_AM_A_TEAPOT"] = 418] = "I_AM_A_TEAPOT";
                HttpStatus[HttpStatus["MISDIRECTED"] = 421] = "MISDIRECTED";
                HttpStatus[HttpStatus["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
                HttpStatus[HttpStatus["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
                HttpStatus[HttpStatus["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
                HttpStatus[HttpStatus["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
                HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
                HttpStatus[HttpStatus["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
                HttpStatus[HttpStatus["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
                HttpStatus[HttpStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
                HttpStatus[HttpStatus["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
                HttpStatus[HttpStatus["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
            })(HttpStatus || (HttpStatus = {}));
            exports_2("HttpStatus", HttpStatus);
        }
    };
});
System.register("express2/cookie.parser", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function cookieParser(req, res, next) {
        var cookies = req.headers.cookie;
        if (!cookies) {
            next();
            return;
        }
        if (!req.cookies)
            req.cookies = {};
        cookies.split(";").forEach(function (c) {
            var n = c.split("=");
            req.cookies[n[0].trim()] = n[1].trim();
        });
        next();
    }
    exports_3("default", cookieParser);
    return {
        setters: [],
        execute: function () {
            ;
        }
    };
});
System.register("express2/mrouter", ["axios", "express", "express2/exceptions"], function (exports_4, context_4) {
    "use strict";
    var axios_1, express_1, exceptions_1, MRouter;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (axios_1_1) {
                axios_1 = axios_1_1;
            },
            function (express_1_1) {
                express_1 = express_1_1;
            },
            function (exceptions_1_1) {
                exceptions_1 = exceptions_1_1;
            }
        ],
        execute: function () {
            MRouter = (function () {
                function MRouter(args) {
                    this.router = express_1.Router();
                    this.cargs = args;
                }
                Object.defineProperty(MRouter.prototype, "raw", {
                    get: function () { return this.router; },
                    enumerable: false,
                    configurable: true
                });
                MRouter.prototype.converter = function (converter) {
                    if (!this.cargs)
                        this.cargs = { converter: converter };
                    else
                        this.cargs.converter = converter;
                };
                MRouter.prototype.callback = function (method, callback) {
                    var _this = this;
                    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var a, e_1, code;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 5, , 6]);
                                    a = callback({ req: req, res: res });
                                    if (!a)
                                        throw "No response";
                                    if (!a.then) return [3, 2];
                                    return [4, a];
                                case 1:
                                    a = _c.sent();
                                    _c.label = 2;
                                case 2:
                                    if (!((_a = this.cargs) === null || _a === void 0 ? void 0 : _a.converter)) return [3, 4];
                                    a = this.cargs.converter(a, { req: req, res: res });
                                    if (!a)
                                        throw "No response";
                                    if (!a.then) return [3, 4];
                                    return [4, a];
                                case 3:
                                    a = _c.sent();
                                    _c.label = 4;
                                case 4:
                                    if (typeof a !== "object") {
                                        a = { message: a };
                                    }
                                    res.status(200).send(a);
                                    return [3, 6];
                                case 5:
                                    e_1 = _c.sent();
                                    if (e_1 instanceof exceptions_1.HttpException) {
                                        return [2, res.status(e_1.status).send({
                                                error: e_1.message, status: e_1.status
                                            })];
                                    }
                                    if (e_1 instanceof axios_1.AxiosError) {
                                        res.status(e_1.status || 400).send(((_b = e_1.response) === null || _b === void 0 ? void 0 : _b.data) || {
                                            error: "AxiosError", status: 400
                                        });
                                        return [2];
                                    }
                                    code = 0;
                                    if (Array.isArray(e_1) && e_1.length == 2) {
                                        if (+e_1[0]) {
                                            code = +e_1[0];
                                            e_1 = e_1[1];
                                        }
                                        else if (+e_1[1]) {
                                            code = +e_1[1];
                                            e_1 = e_1[0];
                                        }
                                        else {
                                            e_1 = e_1[0] + ' ' + e_1[1];
                                        }
                                    }
                                    if (!code && typeof e_1 === "string") {
                                        if (e_1.includes("found")) {
                                            code = exceptions_1.HttpStatus.NOT_FOUND;
                                        }
                                        else
                                            code = exceptions_1.HttpStatus.BAD_REQUEST;
                                    }
                                    if (!code) {
                                        e_1 = "Internal Server Error";
                                        code = exceptions_1.HttpStatus.INTERNAL_SERVER_ERROR;
                                    }
                                    res.status(code).send({
                                        error: e_1,
                                        status: code
                                    });
                                    return [3, 6];
                                case 6: return [2];
                            }
                        });
                    }); };
                };
                MRouter.prototype.get = function (path, callback) {
                    this.router.get(path, this.callback("get", callback));
                };
                MRouter.prototype.post = function (path, callback) {
                    this.router.post(path, this.callback("post", callback));
                };
                return MRouter;
            }());
            exports_4("default", MRouter);
        }
    };
});
System.register("express2/register.routes", ["express2/mrouter"], function (exports_5, context_5) {
    "use strict";
    var mrouter_1;
    var __moduleName = context_5 && context_5.id;
    function toRouter(router) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!router.then) return [3, 2];
                        return [4, router];
                    case 1:
                        router = (_a.sent()).default;
                        _a.label = 2;
                    case 2:
                        if (router instanceof mrouter_1.default)
                            router = router.raw;
                        return [2, router];
                }
            });
        });
    }
    function registerRoutes(app, prefix, routers) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, path, router, _b, _c, _d, _e, _f, np, _g, _h, _j, e_2;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _i = 0, _a = Object.keys(routers);
                        _k.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 11];
                        path = _a[_i];
                        router = routers[path];
                        _k.label = 2;
                    case 2:
                        _k.trys.push([2, 9, , 10]);
                        if (!!path) return [3, 7];
                        if (!!prefix) return [3, 4];
                        _c = (_b = app).use;
                        return [4, toRouter(router)];
                    case 3:
                        _c.apply(_b, [_k.sent()]);
                        return [3, 6];
                    case 4:
                        _e = (_d = app).use;
                        _f = [prefix];
                        return [4, toRouter(router)];
                    case 5:
                        _e.apply(_d, _f.concat([_k.sent()]));
                        _k.label = 6;
                    case 6: return [2];
                    case 7:
                        np = path;
                        if (!np.startsWith("/"))
                            np = "/" + np;
                        if (prefix)
                            np = prefix + np;
                        _h = (_g = app).use;
                        _j = [np];
                        return [4, toRouter(router)];
                    case 8:
                        _h.apply(_g, _j.concat([_k.sent()]));
                        return [3, 10];
                    case 9:
                        e_2 = _k.sent();
                        console.error(e_2);
                        console.error("Failed to register router" + (path ? ' ' + path : '') + ".");
                        return [3, 10];
                    case 10:
                        _i++;
                        return [3, 1];
                    case 11: return [2];
                }
            });
        });
    }
    exports_5("default", registerRoutes);
    return {
        setters: [
            function (mrouter_1_1) {
                mrouter_1 = mrouter_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("express2/express2", ["express", "process", "after.init", "express2/cookie.parser", "express2/register.routes"], function (exports_6, context_6) {
    "use strict";
    var _a, _b, express_2, process_1, after_init_1, cookie_parser_1, register_routes_1, app, showErrors;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (express_2_1) {
                express_2 = express_2_1;
            },
            function (process_1_1) {
                process_1 = process_1_1;
            },
            function (after_init_1_1) {
                after_init_1 = after_init_1_1;
            },
            function (cookie_parser_1_1) {
                cookie_parser_1 = cookie_parser_1_1;
            },
            function (register_routes_1_1) {
                register_routes_1 = register_routes_1_1;
            }
        ],
        execute: function () {
            app = express_2.default();
            app.use(express_2.default.json());
            app.use(cookie_parser_1.default);
            showErrors = ((_b = ((_a = process_1.env.SHOW_DATABASE_ERRORS_IN_FRONEND) === null || _a === void 0 ? void 0 : _a.toString())) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "true";
            app.on("event:after_init", after_init_1.default(app, showErrors));
            process.on('uncaughtException', function (err) {
                console.error("Uncaught Exception: ".concat(typeof err, ": ").concat(err.message));
                console.log(err);
            });
            exports_6("default", {
                app: app,
                SERVER_ID: '',
                start: function (options) {
                    return __awaiter(this, void 0, void 0, function () {
                        var server;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.SERVER_ID = options.id;
                                    return [4, register_routes_1.default(app, options.prefix, options.routes)];
                                case 1:
                                    _a.sent();
                                    app.emit("event:after_init");
                                    server = app.listen(options.port, function () {
                                        if (!options.port)
                                            console.log("No default port at .env was founded. Using random...");
                                        console.log("Server starter at port: " + server.address().port);
                                    });
                                    return [2, server];
                            }
                        });
                    });
                }
            });
        }
    };
});
System.register("tokens", ["path"], function (exports_7, context_7) {
    "use strict";
    var path_1;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (path_1_1) {
                path_1 = path_1_1;
            }
        ],
        execute: function () {
            require('dotenv').config({
                path: path_1.default.join(__dirname, '../global.env')
            });
            exports_7("default", {
                auth: process.env.AUTH_TOKEN,
                refresh: process.env.REFRESH_TOKEN,
                server: process.env.GLOBAL_TOKEN,
                expire: {
                    auth: process.env.AUTH_EXPIRE,
                    refresh: process.env.REFRESH_EXPIRE,
                },
                ip: process.env.GLOBAL_SERVER
            });
        }
    };
});
System.register("api", ["axios", "jsonwebtoken", "express2/exceptions", "express2/express2", "tokens"], function (exports_8, context_8) {
    "use strict";
    var axios_2, jsonwebtoken_1, exceptions_2, express2_1, tokens_1, path, api;
    var __moduleName = context_8 && context_8.id;
    function validMicroServer(header) {
        if (typeof header !== "string")
            header = header['micro-server'];
        try {
            return jsonwebtoken_1.default.verify(header, tokens_1.default.server);
        }
        catch (e) {
            throw new exceptions_2.HttpException("NOT_A_MICRO_SERVER", exceptions_2.HttpStatus.METHOD_NOT_ALLOWED);
        }
    }
    exports_8("validMicroServer", validMicroServer);
    return {
        setters: [
            function (axios_2_1) {
                axios_2 = axios_2_1;
            },
            function (jsonwebtoken_1_1) {
                jsonwebtoken_1 = jsonwebtoken_1_1;
            },
            function (exceptions_2_1) {
                exceptions_2 = exceptions_2_1;
            },
            function (express2_1_1) {
                express2_1 = express2_1_1;
            },
            function (tokens_1_1) {
                tokens_1 = tokens_1_1;
            }
        ],
        execute: function () {
            if (!express2_1.default.SERVER_ID)
                throw "No express.SERVER_ID";
            path = tokens_1.default.ip;
            if (!path)
                throw "NO GLOBAL SERVER IP";
            if (!path.endsWith('/'))
                path += '/';
            path += 'api';
            exports_8("api", api = axios_2.default.create({
                baseURL: path,
                timeout: 5000,
                headers: {
                    'micro-server': jsonwebtoken_1.default.sign({ server: express2_1.default.SERVER_ID }, tokens_1.default.server, { expiresIn: '10d' })
                }
            }));
        }
    };
});
System.register("utils", [], function (exports_9, context_9) {
    "use strict";
    var mstime;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            mstime = require('jsonwebtoken/node_modules/ms/index');
            exports_9("default", {
                replaceLast: function (str, from, to) {
                    var lastIndex = str.lastIndexOf(from);
                    if (lastIndex < 0)
                        return str;
                    return str.substring(0, lastIndex) + to +
                        str.substring(lastIndex + from.length);
                },
                mstime: function (time) {
                    if (typeof time === "number")
                        return time;
                    return mstime(time);
                }
            });
        }
    };
});
System.register("auth.tokens", ["jsonwebtoken", "api", "express2/exceptions", "tokens", "utils"], function (exports_10, context_10) {
    "use strict";
    var jsonwebtoken_2, api_1, exceptions_3, tokens_2, utils_1, AuthTokens;
    var __moduleName = context_10 && context_10.id;
    function co(tokenExpire) {
        return {
            httpOnly: true,
            expires: new Date(Date.now() + utils_1.default.mstime(tokenExpire))
        };
    }
    return {
        setters: [
            function (jsonwebtoken_2_1) {
                jsonwebtoken_2 = jsonwebtoken_2_1;
            },
            function (api_1_1) {
                api_1 = api_1_1;
            },
            function (exceptions_3_1) {
                exceptions_3 = exceptions_3_1;
            },
            function (tokens_2_1) {
                tokens_2 = tokens_2_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            AuthTokens = {
                validUser: function (req, res) {
                    return __awaiter(this, void 0, void 0, function () {
                        var newTokens, e_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    try {
                                        return [2, AuthTokens.verifyAuth(AuthTokens.reqAuthToken(req))];
                                    }
                                    catch (e) { }
                                    if (req.headers.authorization) {
                                        throw new exceptions_3.HttpException("Auth token expired", exceptions_3.HttpStatus.UNAUTHORIZED);
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4, api_1.api.post("/auth/tokens/refresh", {
                                            refresh_token: AuthTokens.reqRefreshToken(req)
                                        })];
                                case 2:
                                    newTokens = (_a.sent()).data;
                                    AuthTokens.setResponseTokens(res, newTokens);
                                    return [2, AuthTokens.verifyAuth(newTokens.auth_token)];
                                case 3:
                                    e_3 = _a.sent();
                                    throw new exceptions_3.HttpException("Unauthorized", exceptions_3.HttpStatus.UNAUTHORIZED);
                                case 4: return [2];
                            }
                        });
                    });
                },
                setResponseTokens: function (res, tokens) {
                    res.cookie("s_refresh_token", tokens.refresh_token, co(tokens_2.default.expire.refresh));
                    res.cookie("s_auth_token", tokens.auth_token, co(tokens_2.default.expire.auth));
                },
                genTokens: function (user) {
                    return {
                        auth_token: AuthTokens.genAuthToken(user),
                        refresh_token: AuthTokens.genRefreshToken(user.userId)
                    };
                },
                reqAuthToken: function (req) {
                    var _a, _b;
                    return ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.s_auth_token) || ((_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization);
                },
                reqRefreshToken: function (req) {
                    var _a, _b;
                    return ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.s_refresh_token) || ((_b = req.body) === null || _b === void 0 ? void 0 : _b.refresh_token);
                },
                genAuthToken: function (user) {
                    return jsonwebtoken_2.default.sign(user, tokens_2.default.auth, {
                        expiresIn: tokens_2.default.expire.auth
                    });
                },
                genRefreshToken: function (userId) {
                    return jsonwebtoken_2.default.sign({ userId: userId }, tokens_2.default.refresh, {
                        expiresIn: tokens_2.default.expire.refresh
                    });
                },
                verifyRefresh: function (refresh_token) {
                    if (refresh_token)
                        try {
                            var user = jsonwebtoken_2.default.verify(refresh_token, tokens_2.default.refresh);
                            user = +user.userId || +user;
                            if (user)
                                return user;
                        }
                        catch (e) { }
                    throw "Invalid refresh token";
                },
                verifyAuth: function (auth_token) {
                    if (auth_token)
                        try {
                            var user = jsonwebtoken_2.default.verify(auth_token, tokens_2.default.auth);
                            if (AuthTokens.isSelfUser(user))
                                return user;
                        }
                        catch (e) { }
                    throw "Invalid token";
                },
                isSelfUser: function (object) {
                    if (!object)
                        return false;
                    return !!object.userId;
                }
            };
            exports_10("default", AuthTokens);
        }
    };
});
System.register("data/dbpath.parser", [], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    function parseDatabasePath(dbpath) {
        var i = dbpath.indexOf(":");
        var type = dbpath.substring(0, i);
        dbpath = dbpath.substring(i + 3);
        i = dbpath.indexOf("@");
        var username = dbpath.substring(0, i).split(":");
        dbpath = dbpath.substring(i + 1);
        i = dbpath.indexOf("/");
        var host = dbpath.substring(0, i);
        dbpath = dbpath.substring(i + 1);
        dbpath = dbpath.split("?")[0];
        var port = 0;
        if (host.includes(":")) {
            i = host.indexOf(":");
            port = +host.substring(i + 1);
            host = host.substring(0, i);
        }
        else {
            port = type === "mysql" ? 3306 : 5432;
        }
        return {
            type: type,
            host: host,
            port: port,
            username: username[0],
            password: username[1],
            database: dbpath
        };
    }
    exports_11("default", parseDatabasePath);
    return {
        setters: [],
        execute: function () {
        }
    };
});
