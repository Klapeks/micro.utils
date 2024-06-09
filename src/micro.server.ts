import axios, { AxiosError, AxiosInstance } from "axios";
import express, { Express, Request, Router } from "express"
import jwt from "jsonwebtoken";
import { AddressInfo } from "net";
import afterInit from "./express-utils/after.init";
import cookieParser from "./express-utils/cookie.parser";
import { HttpException, HttpStatus } from "./express-utils/exceptions";
import registerRoutes from "./express-utils/register.routes";
import globalEnv from "./global.env";
import utils from "./utils";
// import cors from "cors";

export interface ServerOptions {
    id: string,
    port: number,
    /** Absolute path to global.env or paths */
    env: string | {
        folder: string,
        /** @default env.IMPORT_ENV */
        import?: string | string[],
        /** @default env.PORT_YAML */
        portYaml?: string,
    },
    /** @default env.APP */
    app?: string,
    links?: {
        /** @default env.%APP%_DOMAIN */
        domain?: string;
        /** @default env.%APP%_MAIN */
        main?: string;
        /** @default env.%APP%_API */
        api?: string
        /** @default env.AUTH_REFRESH_URL */
        refresh?: string
    },
    logging?: boolean,
    disableUseJson?: boolean
}
type AI = AxiosInstance;
export type MicroAxios = AxiosInstance & {
    getData<T = any>(...params: Parameters<AI['get']>): Promise<T>,
    postData<T = any>(...params: Parameters<AI['post']>): Promise<T>,
    patchData<T = any>(...params: Parameters<AI['patch']>): Promise<T>,
    deleteData<T = any>(...params: Parameters<AI['delete']>): Promise<T>,
}
function is502err(err: any): any {
    if (err?.response?.status === 502) {
        err = err.request.path || err.config.url;
        if (!err) throw new HttpException("Bad Gateway", 502);
        throw new HttpException("Can't access " + err, 502);
    }
    throw err;
}
function toMicroAxios(axios: AxiosInstance): MicroAxios {
    const api = axios as MicroAxios;
    api.getData = async function (...params: Parameters<AI['get']>) {
        return (await api.get(...params).catch(is502err)).data;
    };
    api.postData = async function (...params: Parameters<AI['post']>) {
        return (await api.post(...params).catch(is502err)).data;
    };
    api.deleteData = async function (...params: Parameters<AI['delete']>) {
        return (await api.delete(...params).catch(is502err)).data;
    };
    api.patchData = async function (...params: Parameters<AI['patch']>) {
        return (await api.patch(...params).catch(is502err)).data;
    };
    return api;
}

export default class MicroServer {
    readonly id: string;
    readonly port: number;
    readonly app: Express;
    readonly api: MicroAxios;

    private _loadingRoutes = 0;
    private _started = false;

    constructor(options?: ServerOptions) {
        if (!options) {
            const env = process.env as any;
            if (!env.APP) throw `No APP found in .env (or try to use options param)`;
            const app = (env.APP as string).toUpperCase();
            options = {
                id: env.MICRO_SERVER,
                port: +env.PORT,
                env: env[app+"_PATH"],
                logging: env.DEBUG_MICRO_UTILS == 'true',
                disableUseJson: env.DISABLE_USE_JSON == 'true'
            }
            if (!options.id) throw `No MICRO_SERVER found in .env (or try to use options param)`;
            if (!options.port) throw `No PORT nor PORT_YAML found in .env (or try to use options param)`;
            if (!options.env) throw `No ${app}_PATH found in .env (or try to use options param)`;
        }
        this.id = options.id;
        this.port = options.port;
        globalEnv.parseMicro(options);

        this.app = express();
        this.app.use(cookieParser);
        if (!options.disableUseJson) {
            this.app.use(express.json());
        }
        // this.app.use(cors());

        const showErrors = (process.env.SHOW_DATABASE_ERRORS_IN_FRONEND?.toString())?.toLowerCase() === "true";
        this.app.on("event:after_init", afterInit(this.app, showErrors));
        
        let path = globalEnv.servers.api;
        if (!path) throw "NO API"
        if (path.endsWith('/')) {
            path = path.substring(0, path.length-1);
        }
        if (!path.endsWith('/api')) path += '/api';
        this.api = toMicroAxios(axios.create({
            baseURL: path, timeout: 15000,
        }));
        this.regenerateToken();
        setInterval(() => {
            this.regenerateToken();
        }, 10*60*60*1000) // 10 hours
    }
    private regenerateToken() {
        this.api.defaults.headers['micro-server'] = jwt.sign(
            { server: process.env.MICRO_SERVER_ID || this.id }, 
            globalEnv.tokens.server, { expiresIn: '12h' }
        );
    }

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
        if ('headers' in header) header = header.headers;
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
