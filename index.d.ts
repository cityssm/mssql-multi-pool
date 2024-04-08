import mssql from 'mssql';
export type MSSQLConfig = mssql.config;
export declare function connect(config: MSSQLConfig): Promise<mssql.ConnectionPool>;
export declare function releaseAll(): Promise<void>;
export declare function getPoolCount(): number;
declare const _default: {
    connect: typeof connect;
    releaseAll: typeof releaseAll;
    getPoolCount: typeof getPoolCount;
};
export default _default;
export type { IRecordSet, IResult, Transaction } from 'mssql';
