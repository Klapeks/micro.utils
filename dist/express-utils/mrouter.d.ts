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
export {};
