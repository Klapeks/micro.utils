
interface DatabasePath {
    type: any,
    host: string,
    port: number,
    username: string,
    password?: string,
    database: string,
}
export default function parseDatabasePath(dbpath: string): DatabasePath {
    // mysql://root:root@localhost:3306/diploma_restiki;
    let i = dbpath.indexOf(":")
    const type = dbpath.substring(0, i);
    dbpath = dbpath.substring(i+3);

    i = dbpath.indexOf("@");
    let username = dbpath.substring(0, i).split(":");
    dbpath = dbpath.substring(i+1);

    i = dbpath.indexOf("/");
    let host = dbpath.substring(0, i);
    dbpath = dbpath.substring(i+1);

    dbpath = dbpath.split("?")[0];

    let port = 0;
    if (host.includes(":")) {
        i = host.indexOf(":");
        port = +host.substring(i+1);
        host = host.substring(0, i);
    } else {
        port = type==="mysql" ? 3306 : 5432;
    }
    
    return {
        type, host, port,
        username: username[0],
        password: username[1],
        database: dbpath
    }
}