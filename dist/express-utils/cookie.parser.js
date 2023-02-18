"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cookieParser(req, res, next) {
    var cookies = req.headers.cookie;
    if (!cookies) {
        next();
        return;
    }
    if (!req.cookies)
        req.cookies = {};
    cookies.split(";").forEach(function (c) {
        var n = c.split("=");
        req.cookies[n[0].trim()] = n[1].trim();
    });
    next();
}
exports.default = cookieParser;
;
