import axios from 'axios';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from './express-utils/exceptions';
import globalEnv from './global.env';
import utils from './utils';

export interface SelfUser {
    userId: number,
}

function co(tokenExpire: string) {
    return {
        httpOnly: true,
        expires: new Date(Date.now() + utils.mstime(tokenExpire))
    }
}

const AuthTokens = {
    async validUser(req: Request, res: Response): Promise<SelfUser> {
        try {
            return AuthTokens.verifyAuth(AuthTokens.reqAuthToken(req));
        } catch (e) {}
        if (req.headers.authorization) {
            throw new HttpException("Auth token expired", HttpStatus.UNAUTHORIZED);
        }
        try {
            const newTokens = (await axios.post(globalEnv.servers.auth_refresh, {
                refresh_token: AuthTokens.reqRefreshToken(req)
            })).data;
            AuthTokens.setResponseTokens(res, newTokens);
            return AuthTokens.verifyAuth(newTokens.auth_token);
        } catch(e) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
    },
    setResponseTokens(res: Response, tokens: {
        refresh_token: string, auth_token: string
    }) {
        res.cookie("s_refresh_token", tokens.refresh_token, co(globalEnv.tokens.expire.refresh));
        res.cookie("s_auth_token", tokens.auth_token, co(globalEnv.tokens.expire.auth));
    },
    genTokens(user: SelfUser) {
        return {
            auth_token: AuthTokens.genAuthToken(user),
            refresh_token: AuthTokens.genRefreshToken(user.userId)
        }
    },
    reqAuthToken(req: Request) {
        return req.cookies?.s_auth_token || req.headers?.authorization;
    },
    reqRefreshToken(req: Request) {
        return req.cookies?.s_refresh_token || req.body?.refresh_token;
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
        throw "Invalid refresh token";
    },
    verifyAuth(auth_token: string): SelfUser {
        if (auth_token) try {
            const user = jwt.verify(auth_token, globalEnv.tokens.auth);
            if (AuthTokens.isSelfUser(user)) return user;
        } catch (e) {}
        throw "Invalid token";
    },
    isSelfUser(object: any): object is SelfUser {
        if (!object) return false;
        return !!object.userId;
    }
}

export default AuthTokens;