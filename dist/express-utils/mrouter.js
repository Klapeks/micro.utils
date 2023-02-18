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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var express_1 = require("express");
var exceptions_1 = require("./exceptions");
var MRouter = (function () {
    function MRouter(args) {
        this.router = (0, express_1.Router)();
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
exports.default = MRouter;
