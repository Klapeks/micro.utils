import { AxiosError } from "axios";
import { Request, Response, Router } from "express";
import { HttpException, HttpStatus } from "./exceptions";

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
                if (e instanceof HttpException) {
                    return res.status(e.status).send({
                        error: e.message, status: e.status
                    });
                }
                if (e instanceof AxiosError) {
                    res.status(e.status || 400).send(e.response?.data || {
                        error: "AxiosError", status: 400
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
                    e = "Internal Server Error"
                    code = HttpStatus.INTERNAL_SERVER_ERROR;
                }
                res.status(code).send({
                    error: e, 
                    status: code
                });
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