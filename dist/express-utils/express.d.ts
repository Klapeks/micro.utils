/// <reference types="node" />
declare const _default: {
    app: import("express-serve-static-core").Express;
    SERVER_ID: string;
    start(options: {
        id: string;
        port: number;
        prefix?: string;
        routes: {
            [path: string]: any;
        };
    }): Promise<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>>;
};
export default _default;
