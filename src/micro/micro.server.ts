import { DeepPartial, HttpException, HttpStatus, Logger, utils } from "@klapeks/utils";
import express, { Express, Request, Router } from "express"
import microOptions from "./micro.options";
import globalEnv from "../global.env";
import cookieParser from "../express/cookie.parser";
import afterInit from "../express/after.init";
import { createMicroAxios, MicroAxios } from "./micro.axios";
import jwt from "jsonwebtoken";
import registerRoutes from "../express/router.register";

const logger = new Logger("MicroServer");

export interface MicroServerOptions {
    /** @default env.APP */
    app: string,
    /** @default env.MICRO_SERVER */
    microServer: string,
    /** @default env.PORT or from ports.yml file */
    port: number,

    env: {
        /** @default env.%APP%_PATH */
        folder: string | string[],
        /** @default env.IMPORT_ENV */
        import: string | string[],
        /** @default ports.yml */
        portYaml: string
    },
    links: {
        /** @default env.%APP%_DOMAIN */
        domain: string;
        /** @default env.%APP%_MAIN */
        main: string;
        /** @default env.%APP%_API */
        api: string
        /** @default env.AUTH_REFRESH_URL */
        refresh: string
    },
    express?: {
        /** @default true */
        useJSON?: boolean,
        /** @default true */
        useBodyParser?: boolean,
        /** @default true */
        trustProxy?: boolean,
        /** @default undefined */
        webStatic?: string
    },
    /** @default false */
    debug?: boolean,
}

function isNotFalse(arg: boolean | undefined) {
    return typeof arg === 'boolean' ? arg : true;
}

export default class MicroServer {

    readonly options: MicroServerOptions;
    readonly app: Express;
    readonly api: MicroAxios;
    constructor(options?: DeepPartial<MicroServerOptions>) {
        this.options = microOptions.fix(options || {});
        globalEnv.parseMicro(this.options);

        // --- express ---
        const expOptions = this.options.express || {};
        this.app = express();
        this.app.use(cookieParser);

        if (expOptions.webStatic) {
            this.app.use(express.static(expOptions.webStatic));
            this.app.get('*', (req, res, next) => {
                if (req.url.startsWith('/api')) return next();
                if (!expOptions.webStatic) throw "No webStatic found";
                return res.sendFile(expOptions.webStatic + '/index.html');
            });
        }
        if (isNotFalse(expOptions.useJSON)) {
            this.app.use(express.json());
        }
        if (isNotFalse(expOptions.useBodyParser)) {
            this.app.use(express.urlencoded({ extended: true }));
        }
        if (isNotFalse(expOptions.trustProxy)) {
            this.app.set("trust proxy", true);
        }
        const showErrors = (process.env.SHOW_DATABASE_ERRORS_IN_FRONEND?.toString())?.toLowerCase() === "true";
        this.app.on("event:after_init", afterInit(this.app, showErrors));

        // --- axios api ---
        let apiPath = this.options.links.api;
        if (apiPath.endsWith('/')) {
            apiPath = apiPath.substring(0, apiPath.length-1);
        }
        if (!apiPath.endsWith('/api')) apiPath += '/api';
        this.api = createMicroAxios(apiPath);

        this.regenerateToken();
        setInterval(() => {
            this.regenerateToken();
        }, 10*60*60*1000) // 10 hours
    }

    private regenerateToken() {
        this.api.setHeader('micro-server', jwt.sign(
            { server: this.options.microServer }, 
            globalEnv.tokens.server, { expiresIn: '12h' }
        ));
    }

    private _loadingRoutes = 0;
    async registerRoutes(prefix: string, routes: { [path: string]: any }) {
        if (this.isStarted) throw "Can't load routes when server started";
        this._loadingRoutes += 1;
        try {
            await registerRoutes(this.app, prefix, routes);
        } catch (e) {
            this._loadingRoutes = -1;
            throw e;
        }
        this._loadingRoutes -= 1;
    }

    private _started = false;
    get isStarted() {
        return this._started;
    }
    async start(beforeStart?: () => void | Promise<void>) {
        await utils.delay(200);
        while (this._loadingRoutes) {
            if (this._loadingRoutes < 0) {
                throw "Failed register routers. Micro server will not be started";
            }
            await utils.delay(200);
        }
        this._started = true;
        this.app.emit("event:after_init");
        const server = this.app.listen(this.options.port, async () => {
            if (beforeStart) await beforeStart();
            if (!this.options.port) logger.log("No default port was founded. Using random...");
            logger.log("Server starter at port: " + (server.address() as any).port);
        })
        return server;
    }

    static validMicroServer(header: any) {
        if ('headers' in header) header = header.headers;
        if (typeof header !== "string") header = header['micro-server'];
        try {
            return jwt.verify(header, globalEnv.tokens.server) as object;
        } catch (e) {
            throw new HttpException("NOT_A_MICRO_SERVER", HttpStatus.METHOD_NOT_ALLOWED);
        }
    }
}