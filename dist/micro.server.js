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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var express_1 = __importDefault(require("express"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var after_init_1 = __importDefault(require("./express-utils/after.init"));
var cookie_parser_1 = __importDefault(require("./express-utils/cookie.parser"));
var exceptions_1 = require("./express-utils/exceptions");
var register_routes_1 = __importDefault(require("./express-utils/register.routes"));
var global_env_1 = __importDefault(require("./global.env"));
var MicroServer = (function () {
    function MicroServer(options) {
        var _a, _b;
        this.id = options.id;
        this.port = options.port;
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use(cookie_parser_1.default);
        var showErrors = ((_b = ((_a = process.env.SHOW_DATABASE_ERRORS_IN_FRONEND) === null || _a === void 0 ? void 0 : _a.toString())) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "true";
        this.app.on("event:after_init", (0, after_init_1.default)(this.app, showErrors));
        var path = global_env_1.default.servers.ip;
        if (!path)
            throw "NO GLOBAL SERVER IP";
        if (!path.endsWith('/'))
            path += '/';
        path += 'api';
        this.api = axios_1.default.create({
            baseURL: path,
            timeout: 5000,
            headers: {
                'micro-server': jsonwebtoken_1.default.sign({ server: process.env.MICRO_SERVER_ID }, global_env_1.default.tokens.server, { expiresIn: '10d' })
            }
        });
    }
    MicroServer.prototype.registerRoutes = function (prefix, routes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, (0, register_routes_1.default)(this.app, prefix, routes)];
            });
        });
    };
    MicroServer.prototype.start = function () {
        var _this = this;
        this.app.emit("event:after_init");
        var server = this.app.listen(this.port, function () {
            if (!_this.port)
                console.log("No default port was founded. Using random...");
            console.log("Server starter at port: " + server.address().port);
        });
        return server;
    };
    MicroServer.validMicroServer = function (header) {
        if (typeof header !== "string")
            header = header['micro-server'];
        try {
            return jsonwebtoken_1.default.verify(header, global_env_1.default.tokens.server);
        }
        catch (e) {
            throw new exceptions_1.HttpException("NOT_A_MICRO_SERVER", exceptions_1.HttpStatus.METHOD_NOT_ALLOWED);
        }
    };
    return MicroServer;
}());
exports.default = MicroServer;
process.on('uncaughtException', function (err) {
    console.error("Uncaught Exception:", err, 'error type: ' + typeof err);
});
