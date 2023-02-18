"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function afterInit(app, showErrors) {
    return function () {
        app.use(function (err, req, res, next) {
            if (!err)
                return;
            if (res.headersSent)
                return;
            if (typeof err === "string") {
                res.status(404).send({
                    error: err,
                    status: 404
                });
                return;
            }
            if (Array.isArray(err) && err.length === 2) {
                if (typeof err[0] === "number") {
                    res.status(err[0]).send({
                        error: err[1],
                        status: err[0]
                    });
                    return;
                }
            }
            if (showErrors) {
                res.status(err.statusCode || 500).send({
                    error: err.message || err,
                    type: "unhandled",
                    status: err.statusCode || 404
                });
                return;
            }
            console.error('\x1b[31m', err);
            res.status(err.statusCode || 404).send({
                error: "Server error",
                status: err.statusCode || 404
            });
        });
        app.use(function (req, res, next) {
            res.status(404).send({
                error: "API not found",
                'api-path': req.url,
                status: 404
            });
        });
    };
}
exports.default = afterInit;
