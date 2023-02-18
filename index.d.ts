/// <reference types="express" />
/// <reference types="node" />
declare module "after.init" {
    import { IRouter } from "express";
    export default function afterInit(app: IRouter, showErrors: boolean): () => void;
}
declare module "express2/exceptions" {
    export class HttpException extends Error {
        readonly status: number;
        constructor(response: string, status?: number);
    }
    export class NotAuthException extends HttpException {
        constructor();
    }
    export enum HttpStatus {
        CONTINUE = 100,
        SWITCHING_PROTOCOLS = 101,
        PROCESSING = 102,
        EARLYHINTS = 103,
        OK = 200,
        CREATED = 201,
        ACCEPTED = 202,
        NON_AUTHORITATIVE_INFORMATION = 203,
        NO_CONTENT = 204,
        RESET_CONTENT = 205,
        PARTIAL_CONTENT = 206,
        AMBIGUOUS = 300,
        MOVED_PERMANENTLY = 301,
        FOUND = 302,
        SEE_OTHER = 303,
        NOT_MODIFIED = 304,
        TEMPORARY_REDIRECT = 307,
        PERMANENT_REDIRECT = 308,
        BAD_REQUEST = 400,
        UNAUTHORIZED = 401,
        PAYMENT_REQUIRED = 402,
        FORBIDDEN = 403,
        NOT_FOUND = 404,
        METHOD_NOT_ALLOWED = 405,
        NOT_ACCEPTABLE = 406,
        PROXY_AUTHENTICATION_REQUIRED = 407,
        REQUEST_TIMEOUT = 408,
        CONFLICT = 409,
        GONE = 410,
        LENGTH_REQUIRED = 411,
        PRECONDITION_FAILED = 412,
        PAYLOAD_TOO_LARGE = 413,
        URI_TOO_LONG = 414,
        UNSUPPORTED_MEDIA_TYPE = 415,
        REQUESTED_RANGE_NOT_SATISFIABLE = 416,
        EXPECTATION_FAILED = 417,
        I_AM_A_TEAPOT = 418,
        MISDIRECTED = 421,
        UNPROCESSABLE_ENTITY = 422,
        FAILED_DEPENDENCY = 424,
        PRECONDITION_REQUIRED = 428,
        TOO_MANY_REQUESTS = 429,
        INTERNAL_SERVER_ERROR = 500,
        NOT_IMPLEMENTED = 501,
        BAD_GATEWAY = 502,
        SERVICE_UNAVAILABLE = 503,
        GATEWAY_TIMEOUT = 504,
        HTTP_VERSION_NOT_SUPPORTED = 505
    }
}
declare module "express2/cookie.parser" {
    import { Request } from "express";
    export default function cookieParser(req: Request, res: any, next: any): void;
}
declare module "express2/mrouter" {
    import { Request, Response } from "express";
    interface CallbackType {
        req: Request;
        res: Response;
    }
    type Callback = (callback: CallbackType) => any;
    interface ConstructorArgs {
        converter?: (val: any, callback: CallbackType) => any;
    }
    export default class MRouter {
        private router;
        private cargs;
        constructor(args?: ConstructorArgs);
        get raw(): import("express-serve-static-core").Router;
        converter(converter: (val: any, callback: CallbackType) => any): void;
        private callback;
        get(path: string, callback: Callback): void;
        post(path: string, callback: Callback): void;
    }
}
declare module "express2/register.routes" {
    import { IRouter, Router } from "express";
    import MRouter from "express2/mrouter";
    type R = Router | MRouter | Promise<any>;
    export default function registerRoutes(app: IRouter, prefix: string | undefined, routers: {
        [path: string]: R;
    }): Promise<void>;
}
declare module "express2/express2" {
    const _default: {
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
    export default _default;
}
declare module "tokens" {
    const _default_1: {
        auth: string;
        refresh: string;
        server: string;
        expire: {
            auth: string;
            refresh: string;
        };
        ip: string;
    };
    export default _default_1;
}
declare module "api" {
    export const api: import("axios").AxiosInstance;
    export function validMicroServer(header: any): object;
}
declare module "utils" {
    const _default_2: {
        replaceLast(str: string, from: string, to: string): string;
        mstime(time: string | number): number;
    };
    export default _default_2;
}
declare module "auth.tokens" {
    import { Request, Response } from 'express';
    export interface SelfUser {
        userId: number;
    }
    const AuthTokens: {
        validUser(req: Request, res: Response): Promise<SelfUser>;
        setResponseTokens(res: Response, tokens: {
            refresh_token: string;
            auth_token: string;
        }): void;
        genTokens(user: SelfUser): {
            auth_token: string;
            refresh_token: string;
        };
        reqAuthToken(req: Request): any;
        reqRefreshToken(req: Request): any;
        genAuthToken(user: SelfUser): string;
        genRefreshToken(userId: number): string;
        verifyRefresh(refresh_token: string): number;
        verifyAuth(auth_token: string): SelfUser;
        isSelfUser(object: any): object is SelfUser;
    };
    export default AuthTokens;
}
declare module "data/dbpath.parser" {
    interface DatabasePath {
        type: any;
        host: string;
        port: number;
        username: string;
        password?: string;
        database: string;
    }
    export default function parseDatabasePath(dbpath: string): DatabasePath;
}
