"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
require('dotenv').config({
    path: path_1.default.join(__dirname, '../../../../global.env')
});
exports.default = {
    tokens: {
        auth: process.env.AUTH_TOKEN,
        refresh: process.env.REFRESH_TOKEN,
        server: process.env.GLOBAL_TOKEN,
        expire: {
            auth: process.env.AUTH_EXPIRE,
            refresh: process.env.REFRESH_EXPIRE,
        }
    },
    servers: {
        ip: process.env.GLOBAL_SERVER,
        auth_refresh: process.env.AUTH_REFRESH_URL
    },
    isDebug: process.env.DEBUG == 'true'
};
