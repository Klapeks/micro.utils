import { IRoute, IRouter, Router } from "express";
import MRouter from "./mrouter";
import { Logger } from "@klapeks/utils";

const logger = new Logger("Express");

type R = Router | MRouter | Promise<any>;

async function toRouter(router: R): Promise<Router> {
    if ((router as any).then) router = (await router).default;
    if ('default' in router) router = router.default as any;
    if (router instanceof MRouter) router = router.raw;
    return router;
}

export default async function registerRoutes(
    app: IRouter, prefix: string | undefined, 
    routers: {[path: string]: R | R[]}
) {
    let isRouterError = 0;
    let routerArr: R | R[] = [];
    for (let path of Object.keys(routers)) {
        routerArr = routers[path];
        if (!Array.isArray(routerArr)) {
            routerArr = [routerArr];
        }
        for (let router of routerArr) try {
            if (!path) {
                if (!prefix) app.use(await toRouter(router));
                else app.use(prefix, await toRouter(router));
                continue;
            }
            let np = path;
            if (!np.startsWith("/")) np = "/" + np;
            if (np.startsWith('//')) {
                np = np.substring(1);
            } 
            else if (prefix) np = prefix + np;
            // expressLogger.log(np);
            app.use(np, await toRouter(router));
        } catch (e) {
            logger.error(e);
            logger.error("└─ Failed to register router" + (path ? ' '+path : '') + ".");
            isRouterError += 1;
        }
    }
        
    if (isRouterError) {
        logger.error(`Can't register ${isRouterError} routers`);
        process.exit(1);
    }
}