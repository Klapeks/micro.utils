import { IRoute, IRouter, Router } from "express";
import MRouter from "./mrouter";

type R = Router | MRouter | Promise<any>;

async function toRouter(router: R): Promise<Router> {
    if ((router as any).then) router = (await router).default;
    if (router instanceof MRouter) router = router.raw;
    return router;
}

export default async function registerRoutes(app: IRouter, prefix: string | undefined, routers: {[path: string]: R}) {
    for (let path of Object.keys(routers)) {
        const router = routers[path];
        try {
            if (!path) {
                if (!prefix) app.use(await toRouter(router));
                else app.use(prefix, await toRouter(router));
                return;
            }
            let np = path;
            if (!np.startsWith("/")) np = "/" + np;
            if (prefix) np = prefix + np;
            // console.log(np);
            app.use(np, await toRouter(router));
        } catch (e) {
            console.error(e);
            console.error("Failed to register router" + (path ? ' '+path : '') + ".");
        }
    }
}