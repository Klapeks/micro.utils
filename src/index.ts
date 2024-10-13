import AuthTokens, { SelfUser as ISelfUser } from "./auth.tokens";
import MRouter, { DefaultRoutes } from "./express/mrouter";
import globalEnv from "./global.env";
import { MicroAxios } from "./micro/micro.axios";
import MicroServer, { MicroServerOptions } from "./micro/micro.server";
import mstime from "./utils/mstime";
export * from '@klapeks/utils';

export type SelfUser = ISelfUser;
export {
    MRouter,
    DefaultRoutes,

    MicroAxios,
    MicroServer,
    MicroServerOptions,

    AuthTokens,
    globalEnv,
    mstime
}