import { catchRouterError } from "@klapeks/utils";
import { IRouter } from "express";

export default function afterInit(app: IRouter, showErrors: boolean) {
    return () => {
        app.use((err: any, req: any, res: any, next: any) => {
            if (!err) return;
            if (res.headersSent) return;
            catchRouterError(err, res);
        });
        app.use((req, res, next) => {
            res.status(404).send({
                error: "API not found",
                'api-path': req.url,
                method: req.method,
                status: 404
            })
        });
    }
}