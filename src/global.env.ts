import path from "path"

require('dotenv').config({
    path: path.join(__dirname, '../../../../global.env')
})

export default {
    tokens: {
        auth: process.env.AUTH_TOKEN as string,
        refresh: process.env.REFRESH_TOKEN as string,
        server: process.env.GLOBAL_TOKEN as string,
        expire: {
            auth: process.env.AUTH_EXPIRE as string,
            refresh: process.env.REFRESH_EXPIRE as string,
        }
    },
    servers: {
        ip: process.env.GLOBAL_SERVER as string,
        auth_refresh: process.env.AUTH_REFRESH_URL as string
    },
    isDebug: process.env.DEBUG == 'true'
}