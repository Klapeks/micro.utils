import express, { Request, Router } from "express"
import { AddressInfo } from "net";
import { env } from "process";
import afterInit from "../after.init";
import cookieParser from "./cookie.parser";
import registerRoutes from "./register.routes";

const app = express()
app.use(express.json())
app.use(cookieParser);

const showErrors = (env.SHOW_DATABASE_ERRORS_IN_FRONEND?.toString())?.toLowerCase() === "true";
app.on("event:after_init", afterInit(app, showErrors));

process.on('uncaughtException', err => {
    console.error(`Uncaught Exception: ${typeof err}: ${err.message}`);
    console.log(err);
});

export default {
    app,
    SERVER_ID: '',
    async start(options: {
        id: string,
        port: number,
        prefix?: string,
        routes: { [path: string]: any }
    }) {
        this.SERVER_ID = options.id;
        await registerRoutes(app, options.prefix, options.routes);
        app.emit("event:after_init");
        const server = app.listen(options.port, () => {
            if (!options.port) console.log("No default port at .env was founded. Using random...");
            console.log("Server starter at port: " + (server.address() as AddressInfo).port);
        })
        return server;
    }
};