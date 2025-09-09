import { AuthTokens, TokensPair } from "./auth.tokens";
import { Request, Response } from 'express';
import { AuthTokensErrors } from "./auth.errors";
import axios from "axios";
import { globalEnv } from "../global.env";

export interface SelfUser {
    userId: number,
    globalRole: number
}

export const AuthSession = {
    async validUser<T extends SelfUser>(req: Request, res: Response | null): Promise<T> {
        if (globalEnv.isAuthorizationDisabled) throw ["Authorization is disabled...", 500];
        // valid access token
        try {
            return AuthTokens.validAccessToken<T>(AuthTokens.getAccessTokenFromRequest(req));
        } catch (e) {
            if (AuthTokens.hasAccessTokenInHeaders(req)) {
                throw AuthTokensErrors.ACCESS_TOKEN_EXPIRED;
            }
        }
        // can control by server?
        if (!res || !AuthTokens.isServerControlTokensAllowed(req)) {
            throw AuthTokensErrors.NO_ACCESS_TOKEN;
        }
        // refresh tokens
        try {
            const tokens = await AuthSession.requestRefresh(req);
            AuthTokens.setResponseTokens(res, tokens);
            return AuthTokens.validAccessToken<T>(tokens.access_token);
        } catch(e) {
            throw AuthTokensErrors.UNAUTHORIZED;
        }
    },
    isSelfUser<T extends SelfUser>(object: any): object is T {
        return Boolean(object?.userId);
    },
    async requestRefresh(req: Request): Promise<TokensPair> {
        if (globalEnv.isAuthorizationDisabled) throw ["Authorization is disabled...", 500];
        const result = await axios.post(globalEnv.servers.authRefresh, {
            refresh_token: AuthTokens.getRefreshTokenFromRequest(req)
        });
        if ('tokens' in result.data) return result.data.tokens;
        return result.data;
    }
}