import mssql from "mssql";
export declare const connect: (config: mssql.config) => Promise<mssql.ConnectionPool>;
export declare const releaseAll: () => void;
