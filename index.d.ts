/// <reference types="node" />
/// <reference types="qs" />
/// <reference types="express" />
import afterInit from "./dist/express-utils/after.init";
import { validMicroServer } from "./dist/api";
import { SelfUser as ISelfUser } from "./dist/auth.tokens";
import parseDatabasePath from "./dist/data/dbpath.parser";
import cookieParser from "./dist/express-utils/cookie.parser";
import { HttpException, HttpStatus, NotAuthException } from "./dist/express-utils/exceptions";
import MRouter from "./dist/express-utils/mrouter";
import registerRoutes from "./dist/express-utils/register.routes";
export type SelfUser = ISelfUser;
declare const _default: {
    MRouter: typeof MRouter;
    afterInit: typeof afterInit;
    cookieParser: typeof cookieParser;
    HttpStatus: typeof HttpStatus;
    HttpException: typeof HttpException;
    NotAuthException: typeof NotAuthException;
    express: {
        app: import("express-serve-static-core").Express;
        SERVER_ID: string;
        start(options: {
            id: string;
            port: number;
            prefix?: string;
            routes: {
                [path: string]: any;
            };
        }): Promise<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>>;
    };
    registerRoutes: typeof registerRoutes;
    tokens: {
        auth: string;
        refresh: string;
        server: string;
        expire: {
            auth: string;
            refresh: string;
        };
        ip: string;
    };
    utils: {
        replaceLast(str: string, from: string, to: string): string;
        mstime(time: string | number): number;
    };
    AuthTokens: {
        validUser(req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>): Promise<ISelfUser>;
        setResponseTokens(res: import("express").Response<any, Record<string, any>>, tokens: {
            refresh_token: string;
            auth_token: string;
        }): void;
        genTokens(user: ISelfUser): {
            auth_token: string;
            refresh_token: string;
        };
        reqAuthToken(req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>): any;
        reqRefreshToken(req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>): any;
        genAuthToken(user: ISelfUser): string;
        genRefreshToken(userId: number): string;
        verifyRefresh(refresh_token: string): number;
        verifyAuth(auth_token: string): ISelfUser;
        isSelfUser(object: any): object is ISelfUser;
    };
    api: import("axios").AxiosInstance;
    validMicroServer: typeof validMicroServer;
    parseDatabasePath: typeof parseDatabasePath;
};
export default _default;
