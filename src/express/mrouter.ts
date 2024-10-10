import { Request, Response, Router, NextFunction } from "express";
import { catchRouterError, HttpResponse } from "@klapeks/utils";

type Callback = (req: Request, res: Response) => any;
export type RequestCallback = Callback;

interface ConstructorArgs {
    converter?: (val: any, req: Request, res: Response) => any,
}

type ApiMethod = "get" | "post" | "all" | "delete" | "patch";

export default class MRouter {
    private router = Router();
    private cargs: ConstructorArgs | undefined;

    constructor(args?: ConstructorArgs) {
        this.cargs = args;
    }

    get raw() { return this.router; }

    converter(converter: (val: any, req: Request, res: Response) => any) {
        if (!this.cargs) this.cargs = {converter};
        else this.cargs.converter = converter;
    }

    private callback(method: ApiMethod, callback: Callback) {
        return async (req: Request, res: Response) => {
            try {
                let a = callback(req, res);
                if (!a) throw "No response";
                if (a.then) a = await a;
                if (this.cargs?.converter) {
                    a = this.cargs.converter(a, req, res);
                    if (!a) throw "No response";
                    if (a.then) a = await a;
                }
                if (typeof a !== "object"){
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

    get(path: string, callback: Callback) {
        this.router.get(path, this.callback("get", callback))
    }
    post(path: string, callback: Callback) {
        this.router.post(path, this.callback("post", callback))
    }
    patch(path: string, callback: Callback, withPost = false) {
        this.router.patch(path, this.callback("patch", callback))
        if (withPost) this.post(path, callback);
    }
    delete(path: string, callback: Callback, withPost = false) {
        this.router.delete(path, this.callback("delete", callback))
        if (withPost) this.post(path, callback);
    }
    use(callback: ((req: Request, res: Response) => any) | MRouter) {
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

    all(path: string, callback: Callback) {
        this.router.all(path, this.callback("all", callback))
    }
}

const PingRouter = Router();
PingRouter.all('/', (req, res) => {
    res.status(200).send("pong");
});
const EchoRouter = Router();
EchoRouter.all('/', (req, res) => {
    res.status(200).send(req.body || "Echo");
});
export const DefaultRoutes = {
    PingRouter,
    EchoRouter
}