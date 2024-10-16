import express from "express";
import { catchRouterError, HttpResponse } from "@klapeks/utils";
import globalEnv from "../global.env";

export type RequestCallback = (req: Request, res: Response) => any;
export type Response = express.Response;
export type Request = express.Request & { 
    req: express.Request, res: express.Response 
};

interface ConstructorArgs {
    converter?: (val: any, req: Request, res: Response) => any,
}

type ApiMethod = "get" | "post" | "all" | "delete" | "patch";

export default class MRouter {
    private router = express.Router();
    private cargs: ConstructorArgs | undefined;

    constructor(args?: ConstructorArgs) {
        this.cargs = args;
    }

    get raw() { return this.router; }

    converter(converter: (val: any, req: Request, res: Response) => any) {
        if (!this.cargs) this.cargs = {converter};
        else this.cargs.converter = converter;
    }

    private callback(method: ApiMethod, callback: RequestCallback) {
        return async (_eReq: express.Request, res: express.Response) => {
            try {
                const req = _eReq as Request;
                req.req = req; req.res = res;
                let a = callback(req, res);
                if (!a) throw "No response";
                if (a.then) a = await a;
                if (this.cargs?.converter) {
                    a = this.cargs.converter(a, req, res);
                    if (!a) throw "No response";
                    if (a.then) a = await a;
                }
                if (typeof a !== "object") {
                    a = { message: a };
                }
                if (a instanceof HttpResponse) {
                    return a.sendTo(res);
                }
                res.status(200).send(a);
            } catch (e) {
                catchRouterError(e, res);
            }
        }
    }

    get(path: string, callback: RequestCallback) {
        this.router.get(path, this.callback("get", callback))
    }
    post(path: string, callback: RequestCallback) {
        this.router.post(path, this.callback("post", callback))
    }
    patch(path: string, callback: RequestCallback, withPost = false) {
        this.router.patch(path, this.callback("patch", callback))
        if (withPost) this.post(path, callback);
    }
    delete(path: string, callback: RequestCallback, withPost = false) {
        this.router.delete(path, this.callback("delete", callback))
        if (withPost) this.post(path, callback);
    }
    use(callback: ((req: express.Request, res: express.Response) => any) | MRouter) {
        if (callback instanceof MRouter) {
            this.router.use(callback.raw);
            return;
        }
        const _callback = callback;
        this.router.use(async (req, res, next) => {
            try {
                let a = _callback(req, res);
                if (a && a.then) a = await a;
                return next();
            } catch (e) {
                catchRouterError(e, res);
            }
        })
    }

    all(path: string, callback: RequestCallback) {
        this.router.all(path, this.callback("all", callback))
    }
}

const PingRouter = express.Router();
PingRouter.all('/', (req, res) => {
    res.status(200).send("pong");
});
const EchoRouter = express.Router();
EchoRouter.all('/', (req, res) => {
    res.status(200).send({
        protocol: req.protocol,
        host: req.hostname,
        method: req.method,
        url: req.url,
        body: req.body,
        ips: req.ips,
        micro: globalEnv.serverOptions.microServer
    });
});
export const DefaultRoutes = {
    PingRouter,
    EchoRouter
}