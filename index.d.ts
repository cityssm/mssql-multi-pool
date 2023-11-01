import mssql from 'mssql';
export declare function connect(config: mssql.config): Promise<mssql.ConnectionPool>;
export declare function releaseAll(): void;
export declare function getPoolCount(): number;
declare const _default: {
    connect: typeof connect;
    releaseAll: typeof releaseAll;
    getPoolCount: typeof getPoolCount;
};
export default _default;
