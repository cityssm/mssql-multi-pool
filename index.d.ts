import type mssqlTypes from 'mssql';
export declare const driver: string;
export declare const mssql: typeof import("mssql/msnodesqlv8.js");
export declare function connect(config: mssqlTypes.config): Promise<mssqlTypes.ConnectionPool>;
export declare function releaseAll(): Promise<void>;
export declare function getPoolCount(): number;
declare const _default: {
    driver: string;
    connect: typeof connect;
    releaseAll: typeof releaseAll;
    getPoolCount: typeof getPoolCount;
};
export default _default;
