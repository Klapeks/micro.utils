
interface DatabasePath {
    type: any,
    host: string,
    port: number,
    username: string,
    password?: string,
    database: string,
    logging: boolean
}

export function parseDatabasePath(dbpath: string): DatabasePath {
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
        database: dbpath,
        logging: false
    }
}

/** @param dburl - default: env.DATABASE_URL */
export function dataSourceOptions(dburl?: any): DatabasePath {
    if (!dburl) dburl = process.env.DATABASE_URL;
    if (dburl) return parseDatabasePath(dburl);
    function pickEnv(env: string) {
        env = env.toUpperCase();
        return process.env['APP_DATABASE_'+env] 
            || process.env['DATABASE_'+env];
    }
    return {
        type: pickEnv("type"),
        host: pickEnv("host"),
        port: +pickEnv('port'),
        database: pickEnv('name'),
        username: pickEnv('login'),
        password: pickEnv('password'),
        logging: pickEnv('log_sql') == 'true'
            || pickEnv('sql_log') == 'true',
    }
}
