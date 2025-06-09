import { logger } from "@klapeks/utils";
import { MicroServerOptions } from "./micro/micro.server";

const globalEnv = {
    serverOptions: {} as MicroServerOptions,
    parseMicro(options: MicroServerOptions) {
        const env: any = process.env;
        globalEnv.serverOptions = options;
        globalEnv.utilsLogs = options.debug || false;

        // --- tokens ---
        globalEnv.tokens = {
            auth: env.AUTH_TOKEN || env.ACCESS_TOKEN,
            refresh: env.REFRESH_TOKEN,
            server: env.GLOBAL_TOKEN,
            prefix: env.TOKEN_PREFIX || env.TOKENS_PREFIX,
            expire: {
                auth: env.AUTH_EXPIRE || env.ACCESS_EXPIRE,
                refresh: env.REFRESH_EXPIRE,
            }
        }

        // --- debug ---
        if (globalEnv.isDebug && globalEnv.utilsLogs) {
            // delete globalEnv.parseMicro;
            logger.debug("Global env parsed with options", options);
            logger.debug("Global env parsed to object:", globalEnv);
            // globalEnv.parseMicro = () => {};
        }
    },
    tokens: {
        auth: '',  refresh: '',  server: '',
        prefix: '',
        expire: { auth: '',  refresh: '' }
    },
    get servers() {
        return globalEnv.serverOptions.links;  
    },
    utilsLogs: false,
    isDebug: process.env.DEBUG == 'true',
    
    get isAuthorizationDisabled(): boolean {
        return globalEnv.serverOptions.express?.disableAuthorization || false;
    }
}

export default globalEnv;