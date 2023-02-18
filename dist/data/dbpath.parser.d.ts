interface DatabasePath {
    type: any;
    host: string;
    port: number;
    username: string;
    password?: string;
    database: string;
}
export default function parseDatabasePath(dbpath: string): DatabasePath;
export {};
