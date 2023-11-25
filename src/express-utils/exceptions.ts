import { AxiosError } from "axios";
import { Response } from "express";

export class HttpException extends Error {
    readonly status: number;
    constructor(response: string, status: number = HttpStatus.BAD_REQUEST) {
        super(response);
        this.status = status;
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}
export class NotAuthException extends HttpException {
    constructor() {
        super("NO_AUTH", HttpStatus.UNAUTHORIZED)
    }
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

export function catchRouterError(e: any, res: Response) {
    if (e instanceof HttpException) {
        return res.status(e.status).send({
            error: e.message, status: e.status
        });
    }
    if (e instanceof AxiosError) {
        const status = e.response.status || e.status || 400;
        res.status(status).send(e.response?.data || {
            error: "AxiosError", status
        });
        return;
    }
    let code = 0;
    if (Array.isArray(e) && e.length==2) {
        if (+e[0]) {
            code = +e[0];
            e = e[1];
        } else if (+e[1]) {
            code = +e[1];
            e = e[0];
        } else {
            e = e[0] +' '+ e[1];
        }
    }
    if (!code && typeof e === "string") {
        if (e.includes("found")) {
            code = HttpStatus.NOT_FOUND;
        } else code = HttpStatus.BAD_REQUEST
    }
    if (!code) {
        console.error('\x1b[31m', e);
        e = "Internal Server Error"
        code = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(code).send({
        error: e, 
        status: code
    });
}

