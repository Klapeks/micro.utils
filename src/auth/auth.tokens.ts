import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokensErrors } from './auth.errors';
import { mstime } from '../utils/time.utils';
import { AuthSession, SelfUser } from './auth.session';
import { globalEnv } from '../global.env';
import { getTokensKeys } from './other/token.key';

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

export const AuthTokens = {
    getAccessTokenKey() { return getTokensKeys().access_token_key },
    getRefreshTokenKey() { return getTokensKeys().refresh_token_key },

    /** @deprecated moved to AuthSession.validUser(...) */
    get validUser() { return AuthSession.validUser },
    // --- request/response ---
    isServerControlTokensAllowed(req: Request) {
        const data = req.headers['x-control-tokens']
                || req.headers['X-Control-Tokens'];
        return data !== 'client';
    },
    setResponseTokens(res: Response, tokens: TokensPair) {
        if (globalEnv.isAuthorizationDisabled) return;
        res.cookie(
            getTokensKeys().server_tokens_prefix 
                + getTokensKeys().refresh_token_key, 
            tokens.refresh_token, 
            co(globalEnv.tokens.expire.refresh)
        );
        res.cookie(
            getTokensKeys().server_tokens_prefix 
                + getTokensKeys().access_token_key, 
            tokens.access_token, 
            co(globalEnv.tokens.expire.auth)
        );
    },

    // --- getting from request ---
    accessTokenHeader(): string {
        return globalEnv.serverOptions.express?.authHeader?.toLowerCase() || 'authorization';
    },
    hasAccessTokenInHeaders(req: Request): boolean {
        return !!req.headers?.[AuthTokens.accessTokenHeader()];
    },
    getAccessTokenFromRequest(req: Request): string | undefined {
        let auth: string | undefined = req.headers?.[AuthTokens.accessTokenHeader()] as any;
        if (!auth) {
            const KEYS = getTokensKeys();
            auth = req.cookies?.[KEYS.server_tokens_prefix + KEYS.access_token_key];
        }
        if (!auth) return auth;
        if (auth.toLowerCase().startsWith('bearer')) {
            auth = auth.substring(6);
        }
        return auth.trim();
    },
    getRefreshTokenFromRequest(req: Request): string | undefined {
        let token: string | undefined = req.body?.refresh_token || req.body?.refreshToken;
        if (!token) {
            const KEYS = getTokensKeys();
            token = req.cookies?.[KEYS.server_tokens_prefix + KEYS.access_token_key];
        }
        if (!token) return token;
        if (token.toLowerCase().startsWith('bearer')) {
            token = token.substring(6);
        }
        return token.trim();
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
        if (globalEnv.isAuthorizationDisabled) {
            throw ["Authorization is disabled...", 500];
        }
        return jwt.sign(user, globalEnv.tokens.auth, {
            expiresIn: globalEnv.tokens.expire.auth
        });
    },
    generateRefreshToken(userId: number): string {
        if (globalEnv.isAuthorizationDisabled) {
            throw ["Authorization is disabled...", 500];
        }
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