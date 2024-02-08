import { IRoute, IRouter, Router } from "express";
import globalEnv from "../global.env";
import MRouter from "./mrouter";

type R = Router | MRouter | Promise<any>;

async function toRouter(router: R): Promise<Router> {
    if ((router as any).then) router = (await router).default;
    if (router instanceof MRouter) router = router.raw;
    return router;
}

export default async function registerRoutes(app: IRouter, prefix: string | undefined, routers: {[path: string]: R | R[]}) {
    let isRouterError = 0;
    let _routers: R | R[] = [];
    for (let path of Object.keys(routers)) {
        if (globalEnv.isDebug) console.log('loading routes...', prefix, path);
        _routers = routers[path];
        if (!Array.isArray(_routers)) _routers = [_routers];
        for (let router of _routers) {
            try {
                if (!path) {
                    if (!prefix) app.use(await toRouter(router));
                    else app.use(prefix, await toRouter(router));
                    if (globalEnv.isDebug) console.log('router was loaded', prefix, path)
                    return;
                }
                let np = path;
                if (!np.startsWith("/")) np = "/" + np;
                if (prefix) np = prefix + np;
                // console.log(np);
                app.use(np, await toRouter(router));
                if (globalEnv.isDebug) console.log('router was loaded', np);
            } catch (e) {
                console.error(e);
                console.error("Failed to register router" + (path ? ' '+path : '') + ".");
                isRouterError += 1;
            }
        }
    }
    if (isRouterError) {
        console.error(`Can't register ${isRouterError} routers`);
        process.exit(1);
    }
}