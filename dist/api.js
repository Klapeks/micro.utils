"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validMicroServer = exports.api = void 0;
var axios_1 = __importDefault(require("axios"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var exceptions_1 = require("./express-utils/exceptions");
var express_1 = __importDefault(require("./express-utils/express"));
var tokens_1 = __importDefault(require("./tokens"));
if (!express_1.default.SERVER_ID)
    throw "No express.SERVER_ID";
var path = tokens_1.default.ip;
if (!path)
    throw "NO GLOBAL SERVER IP";
if (!path.endsWith('/'))
    path += '/';
path += 'api';
exports.api = axios_1.default.create({
    baseURL: path,
    timeout: 5000,
    headers: {
        'micro-server': jsonwebtoken_1.default.sign({ server: express_1.default.SERVER_ID }, tokens_1.default.server, { expiresIn: '10d' })
    }
});
function validMicroServer(header) {
    if (typeof header !== "string")
        header = header['micro-server'];
    try {
        return jsonwebtoken_1.default.verify(header, tokens_1.default.server);
    }
    catch (e) {
        throw new exceptions_1.HttpException("NOT_A_MICRO_SERVER", exceptions_1.HttpStatus.METHOD_NOT_ALLOWED);
    }
}
exports.validMicroServer = validMicroServer;
