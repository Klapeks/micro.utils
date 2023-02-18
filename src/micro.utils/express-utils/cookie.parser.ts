import { Request } from "express";

export default function cookieParser(req: Request, res: any, next: any) {
    const cookies = req.headers.cookie;
    if (!cookies) { next(); return; }
    if (!req.cookies) req.cookies = {};
    cookies.split(";").forEach((c) => {
        let n = c.split("=");
        req.cookies[n[0].trim()] = n[1].trim();
    })
    next();
};