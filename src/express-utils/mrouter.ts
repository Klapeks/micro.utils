import { Request, Response, Router } from "express";
import { catchRouterError } from "./exceptions";

interface CallbackType {
    req: Request;
    res: Response;
}
type Callback = (callback: CallbackType) => any;

interface ConstructorArgs {
    converter?: (val: any, callback: CallbackType) => any,
}

export default class MRouter {
    private router = Router();
    private cargs: ConstructorArgs | undefined

    constructor(args?: ConstructorArgs) {
        // if (typeof args === "string") args = {auth: args};
        this.cargs = args;
    }

    get raw() { return this.router; }

    converter(converter: (val: any, callback: CallbackType) => any) {
        if (!this.cargs) this.cargs = {converter};
        else this.cargs.converter = converter;
    }

    private _use(callback: Callback) {
        return async (req: Request, res: Response) => {
            try {
                let a = callback({req, res});
                if (!a) throw "No response";
                if (a.then) a = await a;
                if (this.cargs?.converter) {
                    a = this.cargs.converter(a, {req, res});
                    if (!a) throw "No response";
                    if (a.then) a = await a;
                }
                if (typeof a !== "object"){
                    a = {message: a};
                }
                res.status(200).send(a);
            } catch (e) {
                catchRouterError(e, res);
            }
        }
    }

    get(path: string, callback: Callback) {
        this.router.get(path, this._use(callback))
    }
    post(path: string, callback: Callback) {
        this.router.post(path, this._use(callback))
    }
    delete(path: string, callback: Callback, withPost = false) {
        this.router.delete(path, this._use(callback));
        if (withPost) this.post(path, callback);
    }
    patch(path: string, callback: Callback, withPost = false) {
        this.router.patch(path, this._use(callback))
        if (withPost) this.post(path, callback);
    }
    put(path: string, callback: Callback, withPost = false) {
        this.router.put(path, this._use(callback))
        if (withPost) this.post(path, callback);
    }
    all(path: string, callback: Callback) {
        this.router.all(path, this._use(callback))
    }

    use(router: Router | MRouter | Promise<any>): void {
        if ('default' in router) {
            router = router.default as any;
        }
        if ('raw' in router) router = router.raw;
        if ('then' in router) {
            router.then((r) => this.use(r));
            return;
        } 
        this.raw.use(router);
    }
}

const PingRouter = Router();
PingRouter.all('/', (req, res) => {
    res.status(200).send("pong");
});
export const DefaultRoutes = {
    PingRouter
}