import { Request, Response } from 'express';
export interface SelfUser {
    userId: number;
}
declare const AuthTokens: {
    validUser(req: Request, res: Response): Promise<SelfUser>;
    setResponseTokens(res: Response, tokens: {
        refresh_token: string;
        auth_token: string;
    }): void;
    genTokens(user: SelfUser): {
        auth_token: string;
        refresh_token: string;
    };
    reqAuthToken(req: Request): any;
    reqRefreshToken(req: Request): any;
    genAuthToken(user: SelfUser): string;
    genRefreshToken(userId: number): string;
    verifyRefresh(refresh_token: string): number;
    verifyAuth(auth_token: string): SelfUser;
    isSelfUser(object: any): object is SelfUser;
};
export default AuthTokens;
