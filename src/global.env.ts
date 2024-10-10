import pathMod from "path"
import fs from "fs"
import { ServerOptions } from "./micro/micro.server";
import dotenv from 'dotenv';
import { logger } from "@klapeks/utils";

function dotenvConfig(path: string) {
    dotenv.config({ path });
}

function implementAppEnv(app: string, links?: ServerOptions['links']) {
    app = app.toUpperCase();
    const env: any = process.env;
    if (!links) links = {};
    if (!links.domain) links.domain = env[app+"_DOMAIN"];
    if (!links.main) links.main = env[app+"_MAIN"];
    if (!links.api) links.api = env[app+"_API"];
    if (!links.refresh) links.refresh = env['AUTH_REFRESH_URL'];
    
    if (links.domain) globalEnv.servers.domain = links.domain;
    if (links.main) globalEnv.servers.main = links.main;
    if (links.api) globalEnv.servers.api = links.api;
    if (links.refresh) globalEnv.servers.auth_refresh = links.refresh;
}
function implementEnv(options: ServerOptions) {
    const env: any = process.env;

    globalEnv.isDebug = env.DEBUG == 'true';

    globalEnv.servers = {
        domain: env.GLOBAL_SERVER,
        main: env.GLOBAL_SERVER,
        api: env.GLOBAL_SERVER,
        auth_refresh: env.AUTH_REFRESH_URL
    }
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
    if (options.app || env.APP) {
        const app: string = options.app || env.APP;
        implementAppEnv(app, options.links);
    }
}
function parseEnv(env: ServerOptions['env']) {
    if (typeof env == 'string') {
        if (env.endsWith('global.env')) {
            return dotenvConfig(env);
        }
        env = { folder: env };
    }
    if (!env.portYaml) {
        env.portYaml = process.env.PORT_YAML;
    }
    if (!env.import) {
        env.import = process.env.IMPORT_ENV;
    }
    if (typeof env.import == 'string') {
        if (env.import.includes(',')) {
            env.import = env.import.split(',');
        } else {
            env.import = env.import.split(" ");
        }
    }
    for (let file of env.import as string[]) {
        file = file.trim();
        if (!file) continue;
        if (!file.endsWith('.env')) {
            file += '.env';
        }
        file = pathMod.join(env.folder, file);
        logger.debug("env parsing", file);
        if (!fs.existsSync(file)) {
            throw new Error(`No file ${file} found for be parsed as .env`);
        }
        dotenvConfig(file);
    }
}
const globalEnv = {
    parseMicro(options: ServerOptions) {
        globalEnv.utilsLogs = options.logging || false;
        parseEnv(options.env);
        implementEnv(options);
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
    servers: { 
        main: '',
        domain: '',
        api: '',
        auth_refresh: '' 
    },
    utilsLogs: false,
    isDebug: false
}

export default globalEnv;