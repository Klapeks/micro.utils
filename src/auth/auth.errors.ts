import { HttpException, HttpStatus } from "@klapeks/utils";

export const AuthTokensErrors = {
    UNAUTHORIZED: new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED, 'Unauthorized'),
    NO_ACCESS_TOKEN: new HttpException("NO_ACCESS_TOKEN", HttpStatus.UNAUTHORIZED, "Needed auth token in headers"),
    ACCESS_TOKEN_EXPIRED: new HttpException("ACCESS_TOKEN_EXPIRED", HttpStatus.LOCKED, "Auth token expired"),
    REFRESH_TOKEN_EXPIRED: new HttpException("REFRESH_TOKEN_EXPIRED", HttpStatus.LOCKED, "Refresh token expired"),
} as const;