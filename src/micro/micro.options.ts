import { DeepPartial, logger, utils } from "@klapeks/utils";
import { MicroServerOptions } from "./micro.server";
import fs from 'fs';
import mPath from 'path';
import dotenv from 'dotenv';

function dotenvConfig(path: string) {
    dotenv.config({ path });
}

function pickEnv(key: string, error?: string) {
    if (process.env[key]) return process.env[key];
    throw error || `No ${key} in .env found nor in micro-server options`;
}
function findEnvFolder(paths: string | (string | undefined)[]): string {
    if (!paths) return '';
    if (!Array.isArray(paths)) paths = [paths];
    if (!paths.length) return '';
    if (paths.length == 1 && !paths[0]) return '';
    for (let p of paths) {
        if (!p) continue;
        if (fs.existsSync(p)) return p;
    }
    throw "No env path found";
}

export const microOptions = {
    loadEnvs(folder: string, envs: string | string[]) {
        if (!Array.isArray(envs)) envs = [envs];
        for (let file of envs) {
            if (!file) continue;
            if (!file.endsWith('.env')) {
                file += '.env';
            }
            file = mPath.join(folder, file);
            logger.debug("env parsing", file);
            if (!fs.existsSync(file)) {
                throw new Error(`No file ${file} found for be parsed as .env`);
            }
            dotenvConfig(file);
        }
    },
    loadPorts(folder: string, file: string): { [ms: string]: number } | undefined {
        file = mPath.join(folder, file);
        if (!fs.existsSync(file)) return undefined;
        logger.debug("Loading ports from ", file);
        return JSON.parse(fs.readFileSync(file).toString());
    },
    fix(options: DeepPartial<MicroServerOptions>): MicroServerOptions {
        if (!options.app) options.app = pickEnv('APP');
        if (!options.microServer) options.microServer = pickEnv('MICRO_SERVER');
        if (!options.port) options.port = Number(process.env.PORT);
        if (!options.debug) options.debug = process.env.DEBUG == 'true';
    
        const APP_ENV_NAME = utils.replaceAll(options.app!.toUpperCase(), '-', '_');
        
        // ---- env ----
        if (options.env !== null) {
            const oenv = options.env || {};
            if (!oenv.folder) oenv.folder = pickEnv(APP_ENV_NAME + "_PATH");
            if (!oenv.portsJson) oenv.portsJson = process.env[APP_ENV_NAME + "_PORTS_INFO"] || 'ports.json';
            if (!oenv.import && process.env.IMPORT_ENV) {
                oenv.import = process.env.IMPORT_ENV;
                if (oenv.import.includes(',')) {
                    oenv.import = oenv.import.split(',');
                } else {
                    oenv.import = oenv.import.split(" ");
                }
                if (Array.isArray(oenv.import)) {
                    for (let i = 0; i < oenv.import.length; i++) {
                        oenv.import[i] = oenv.import[i].trim();
                    }
                }
            }
            options.env = oenv;

            // --- env loading --- 
            const envFolder = findEnvFolder(oenv.folder!);
            if (oenv.import?.length) {
                microOptions.loadEnvs(envFolder, oenv.import);
            }
            if (!options.port && oenv.portsJson?.length) {
                const ports = microOptions.loadPorts(envFolder, oenv.portsJson);
                options.port = Number(ports?.[options.microServer!]);
            }
        }
        if (!options.port) throw "No PORT in .env or in ports.json for " + options.microServer;
        if (!options.host) options.host = process.env.APP_HOST || '0.0.0.0';
        
        // --- links ---
        const links = options.links || {};
        if (!links.domain) links.domain = pickEnv(APP_ENV_NAME + "_DOMAIN");
        if (!links.main) links.main = pickEnv(APP_ENV_NAME + "_MAIN");
        if (!links.api) links.api = pickEnv(APP_ENV_NAME + "_API");
        if (!links.authRefresh) {
            if (options.express?.disableAuthorization) {
                links.authRefresh = '';
            } else {
                links.authRefresh = pickEnv("AUTH_REFRESH_URL");
            }
        }
        options.links = links;

        return options as any;
    }
}