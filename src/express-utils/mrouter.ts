import { AxiosError } from "axios";
import { Request, Response, Router } from "express";
import { HttpException, HttpStatus, catchRouterError } from "./exceptions";

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

    private callback(method: "get" | "post", callback: Callback) {
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
        this.router.get(path, this.callback("get", callback))
    }

    post(path: string, callback: Callback) {
        this.router.post(path, this.callback("post", callback))
    }
}