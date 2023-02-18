/// <reference types="node" />
import { AxiosInstance } from "axios";
import { Express } from "express";
interface ServerOptions {
    id: string;
    port: number;
}
export default class MicroServer {
    readonly id: string;
    readonly port: number;
    readonly app: Express;
    readonly api: AxiosInstance;
    constructor(options: ServerOptions);
    registerRoutes(prefix: string, routes: {
        [path: string]: any;
    }): Promise<void>;
    start(beforeStart?: () => void | Promise<void>): import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    static validMicroServer(header: any): object;
}
export {};
