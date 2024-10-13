import axios from 'axios';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import globalEnv from './global.env';
import mstime from './utils/mstime';
import { HttpException, HttpStatus } from '@klapeks/utils';

export interface SelfUser {
    userId: number,
    globalRole: number
}
export interface TokensPair {
    access_token: string,
    refresh_token: string
    /** @deprecated alias for access_token */
    auth_token: string,
    __comment?: any
}

function co(tokenExpire: string) {
    return {
        httpOnly: true,
        expires: new Date(Date.now() + mstime(tokenExpire))
    }
}

const TOKENS_PREFIX = (() => {
    let prefix = process.env.TOKENS_PREFIX as string;
    if (prefix?.includes('-')) return prefix + '-';
    if (!prefix) prefix = 'mi';
    return prefix + '_';
})();
const [ACCESS_TOKEN, REFRESH_TOKEN] = (() => {
    if (TOKENS_PREFIX.includes('-')) {
        return [ 'access-token', 'refresh-token' ];
    }
    return  [ 'access_token', 'refresh_token' ];
})();

const AuthTokens = {
    async validUser(req: Request, res: Response | null): Promise<SelfUser> {
        try {
            return AuthTokens.verifyAuth(AuthTokens.reqAuthToken(req));
        } catch (e) {}
        if (req.headers.authorization) {
            throw new HttpException("Auth token expired", HttpStatus.LOCKED);
        }
        if (!res || !AuthTokens.isServerControlTokensAllowed(req)) {
            throw new HttpException("Needed auth token in headers", HttpStatus.UNAUTHORIZED);
        }
        try {
            let refreshResponse = (await axios.post(globalEnv.servers.refresh, {
                refresh_token: AuthTokens.reqRefreshToken(req)
            })).data;
            if ('tokens' in refreshResponse) refreshResponse = refreshResponse.tokens;
            AuthTokens.setResponseTokens(res, refreshResponse);
            return AuthTokens.verifyAuth(refreshResponse.access_token);
        } catch(e) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
    },
    isServerControlTokensAllowed(req: Request) {
        const data = req.headers['x-control-tokens']
                || req.headers['X-Control-Tokens'];
        return data !== 'client';
    },
    setResponseTokens(res: Response, tokens: TokensPair) {
        res.cookie('s'+REFRESH_TOKEN, tokens.refresh_token, co(globalEnv.tokens.expire.refresh));
        res.cookie('s'+ACCESS_TOKEN, tokens.access_token, co(globalEnv.tokens.expire.auth));
    },
    genTokens(user: SelfUser): TokensPair {
        const access_token = AuthTokens.genAuthToken(user);
        return {
            auth_token: access_token, access_token,
            refresh_token: AuthTokens.genRefreshToken(user.userId),
            __comment: "auth_token field is deprecated"
        }
    },
    reqAuthToken(req: Request) {
        let auth: string = req.headers?.authorization 
            || req.cookies?.['s'+ACCESS_TOKEN];
        if (!auth) return auth;
        if (auth.toLowerCase().startsWith('bearer')) {
            auth = auth.substring(6);
        }
        while (auth[0] == ' ') auth = auth.substring(1);
        return auth;
    },
    reqRefreshToken(req: Request) {
        return req.body?.refresh_token || req.cookies?.['s'+REFRESH_TOKEN];
    },
    genAuthToken(user: SelfUser): string {
        return jwt.sign(user, globalEnv.tokens.auth, {
            expiresIn: globalEnv.tokens.expire.auth
        });
    },
    genRefreshToken(userId: number): string {
        return jwt.sign({userId}, globalEnv.tokens.refresh, {
            expiresIn: globalEnv.tokens.expire.refresh
        });
    },
    verifyRefresh(refresh_token: string): number {
        if (refresh_token) try {
            let user = jwt.verify(refresh_token, globalEnv.tokens.refresh) as any;
            user = +(user as any).userId || +user;
            if (user) return user;
        } catch (e) {}
        throw new HttpException("Refresh token expired", HttpStatus.LOCKED);
    },
    verifyAuth(access_token: string): SelfUser {
        if (access_token) try {
            const user = jwt.verify(access_token, globalEnv.tokens.auth);
            if (AuthTokens.isSelfUser(user)) return user;
        } catch (e) {}
        throw new HttpException("Auth token expired", HttpStatus.LOCKED);
    },
    isSelfUser(object: any): object is SelfUser {
        if (!object) return false;
        return !!object.userId;
    }
}

export default AuthTokens;