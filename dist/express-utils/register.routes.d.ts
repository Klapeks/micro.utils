import { IRouter, Router } from "express";
import MRouter from "./mrouter";
type R = Router | MRouter | Promise<any>;
export default function registerRoutes(app: IRouter, prefix: string | undefined, routers: {
    [path: string]: R;
}): Promise<void>;
export {};
