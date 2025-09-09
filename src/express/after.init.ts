import { catchRouterError } from "@klapeks/utils";
import { IRouter } from "express";
import { globalEnv } from "../global.env";

export function afterInit(app: IRouter, showErrors: boolean) {
    return () => {
        app.use((err: any, req: any, res: any, next: any) => {
            if (!err) return;
            if (res.headersSent) return;
            catchRouterError(err, res);
        });
        app.use((req, res, next) => {
            res.status(404).send({
                status: 404,
                error: "API not found",
                'api-path': req.url,
                method: req.method,
                micro: globalEnv.serverOptions.microServer,
            })
        });
    }
}