import axios, { AxiosInstance } from "axios";
import express, { Express, Request, Router } from "express"
import jwt from "jsonwebtoken";
import { AddressInfo } from "net";
import afterInit from "./express-utils/after.init";
import cookieParser from "./express-utils/cookie.parser";
import { HttpException, HttpStatus } from "./express-utils/exceptions";
import registerRoutes from "./express-utils/register.routes";
import globalEnv from "./global.env";
import utils from "./utils";

interface ServerOptions {
    id: string,
    port: number
}

export default class MicroServer {
    readonly id: string;
    readonly port: number;
    readonly app: Express;
    readonly api: AxiosInstance;

    private _loadingRoutes = 0;
    private _started = false;

    constructor(options: ServerOptions) {
        this.id = options.id;
        this.port = options.port;

        this.app = express()
        this.app.use(express.json())
        this.app.use(cookieParser);

        const showErrors = (process.env.SHOW_DATABASE_ERRORS_IN_FRONEND?.toString())?.toLowerCase() === "true";
        this.app.on("event:after_init", afterInit(this.app, showErrors));
        
        let path = globalEnv.servers.ip;
        if (!path) throw "NO GLOBAL SERVER IP"
        if (!path.endsWith('/')) path += '/'
        path += 'api';
        this.api = axios.create({
            baseURL: path,
            timeout: 5000,
            headers: {
                'micro-server': jwt.sign(
                    { server: process.env.MICRO_SERVER_ID }, 
                    globalEnv.tokens.server, 
                    { expiresIn: '10d' }
                )
            }
        });
    }

    async registerRoutes(prefix: string, routes: { [path: string]: any }) {
        if (this.isStarted) throw "Can't load routes when server started";
        this._loadingRoutes += 1;
        await registerRoutes(this.app, prefix, routes);
        this._loadingRoutes -= 1;
    }

    async start(beforeStart?: () => void | Promise<void>) {
        await utils.delay(100);
        while (this._loadingRoutes) {
            await utils.delay(100);
        }
        this._started = true;
        this.app.emit("event:after_init");
        const server = this.app.listen(this.port, async () => {
            if (beforeStart) await beforeStart();
            if (!this.port) console.log("No default port was founded. Using random...");
            console.log("Server starter at port: " + (server.address() as AddressInfo).port);
        })
        return server;
    }

    get isStarted() {
        return this._started;
    }

    static validMicroServer(header: any) {
        if (typeof header !== "string") header = header['micro-server'];
        try {
            return jwt.verify(header, globalEnv.tokens.server) as object;
        } catch (e) {
            throw new HttpException("NOT_A_MICRO_SERVER", HttpStatus.METHOD_NOT_ALLOWED);
        }
    }
}


process.on('uncaughtException', err => {
    console.error(`Uncaught Exception:`, err, 
            'error type: ' + typeof err);
});
