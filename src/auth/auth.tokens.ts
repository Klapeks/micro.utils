import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import globalEnv from '../global.env';
import AuthSession, { SelfUser } from './auth.session';
import { AuthTokensErrors } from './auth.errors';
import { mstime } from '../utils/time.utils';

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
        return [ TOKENS_PREFIX + 'access-token', TOKENS_PREFIX + 'refresh-token' ];
    }
    return  [ TOKENS_PREFIX + 'access_token', TOKENS_PREFIX + 'refresh_token' ];
})();
const SERVER_PREFIX = ACCESS_TOKEN.includes('-') ? 's-' : 's_';

const AuthTokens = {
    /** @deprecated moved to AuthSession.validUser(...) */
    get validUser() { return AuthSession.validUser },
    // --- request/response ---
    isServerControlTokensAllowed(req: Request) {
        const data = req.headers['x-control-tokens']
                || req.headers['X-Control-Tokens'];
        return data !== 'client';
    },
    setResponseTokens(res: Response, tokens: TokensPair) {
        res.cookie(SERVER_PREFIX + REFRESH_TOKEN, tokens.refresh_token, co(globalEnv.tokens.expire.refresh));
        res.cookie(SERVER_PREFIX + ACCESS_TOKEN, tokens.access_token, co(globalEnv.tokens.expire.auth));
    },

    // --- getting from request ---
    accessTokenHeader(): string {
        return globalEnv.serverOptions.express?.authHeader?.toLowerCase() || 'authorization';
    },
    hasAccessTokenInHeaders(req: Request): boolean {
        return !!req.headers?.[AuthTokens.accessTokenHeader()];
    },
    getAccessTokenFromRequest(req: Request): string | undefined {
        let auth: string | undefined = req.headers?.[AuthTokens.accessTokenHeader()]
            || req.cookies?.[SERVER_PREFIX + ACCESS_TOKEN];
        if (!auth) return auth;
        if (auth.toLowerCase().startsWith('bearer')) {
            auth = auth.substring(6);
        }
        return auth.trim();
    },
    getRefreshTokenFromRequest(req: Request): string | undefined {
        return req.body?.refresh_token || req.cookies?.[SERVER_PREFIX + REFRESH_TOKEN];
    },

    // --- generating ---
    generateTokens(user: SelfUser): TokensPair {
        const access_token = AuthTokens.generateAuthToken(user);
        return {
            access_token, auth_token: access_token,
            refresh_token: AuthTokens.generateRefreshToken(user.userId),
            __comment: "auth_token field is deprecated"
        }
    },
    generateAuthToken(user: SelfUser): string {
        return jwt.sign(user, globalEnv.tokens.auth, {
            expiresIn: globalEnv.tokens.expire.auth
        });
    },
    generateRefreshToken(userId: number): string {
        return jwt.sign({ userId }, globalEnv.tokens.refresh, {
            expiresIn: globalEnv.tokens.expire.refresh
        });
    },
    
    // --- validating ---
    validRefreshToken(refresh_token: string): number {
        if (refresh_token) try {
            let user = jwt.verify(refresh_token, globalEnv.tokens.refresh) as any;
            user = +(user as any).userId || +user;
            if (user) return user;
        } catch (e) {}
        throw AuthTokensErrors.REFRESH_TOKEN_EXPIRED;
    },
    validAccessToken<T extends SelfUser>(access_token: string | undefined): T {
        if (access_token) try {
            const user = jwt.verify(access_token, globalEnv.tokens.auth);
            if (AuthSession.isSelfUser<T>(user)) return user;
        } catch (e) {}
        throw AuthTokensErrors.ACCESS_TOKEN_EXPIRED;
    }
}

export default AuthTokens;