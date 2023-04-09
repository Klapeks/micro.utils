import pathMod from "path"

const globalEnv = {
    parseEnv(absolutePath: string) {
        if (!absolutePath.endsWith('global.env')) {
            absolutePath = pathMod.join(absolutePath, 'global.env');
        }
        require('dotenv').config({ path: absolutePath });

        globalEnv.isDebug = process.env.DEBUG == 'true';

        globalEnv.servers = {
            ip: process.env.GLOBAL_SERVER,
            auth_refresh: process.env.AUTH_REFRESH_URL
        }
        globalEnv.tokens = {
            auth: process.env.AUTH_TOKEN,
            refresh: process.env.REFRESH_TOKEN,
            server: process.env.GLOBAL_TOKEN,
            expire: {
                auth: process.env.AUTH_EXPIRE,
                refresh: process.env.REFRESH_EXPIRE,
            }
        }
    },
    tokens: {
        auth: '',  refresh: '',  server: '',
        expire: { auth: '',  refresh: '' }
    },
    servers: { ip: '',  auth_refresh: '' },
    isDebug: false
}

export default globalEnv;