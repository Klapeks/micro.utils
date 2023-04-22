import { IRouter } from "express";
import { catchRouterError } from "./exceptions";

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
                status: 404
            })
        });
    }
}