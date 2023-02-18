import afterInit from "./after.init";
import { api, validMicroServer } from "./api";
import AuthTokens from "./auth.tokens";
import cookieParser from "./express/cookie.parser";
import { HttpException, HttpStatus, NotAuthException } from "./express/exceptions";
import express from "./express/express";
import MRouter from "./express/mrouter";
import registerRoutes from "./express/register.routes";
import tokens from "./tokens";
import utils from "./utils";

export default {
    MRouter,
    afterInit,
    cookieParser,
    HttpStatus,
    HttpException,
    NotAuthException,
    express,
    registerRoutes,
    tokens,
    utils,
    AuthTokens,
    api,
    validMicroServer
}