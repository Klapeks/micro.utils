"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseDatabasePath(dbpath) {
    var i = dbpath.indexOf(":");
    var type = dbpath.substring(0, i);
    dbpath = dbpath.substring(i + 3);
    i = dbpath.indexOf("@");
    var username = dbpath.substring(0, i).split(":");
    dbpath = dbpath.substring(i + 1);
    i = dbpath.indexOf("/");
    var host = dbpath.substring(0, i);
    dbpath = dbpath.substring(i + 1);
    dbpath = dbpath.split("?")[0];
    var port = 0;
    if (host.includes(":")) {
        i = host.indexOf(":");
        port = +host.substring(i + 1);
        host = host.substring(0, i);
    }
    else {
        port = type === "mysql" ? 3306 : 5432;
    }
    return {
        type: type,
        host: host,
        port: port,
        username: username[0],
        password: username[1],
        database: dbpath
    };
}
exports.default = parseDatabasePath;
