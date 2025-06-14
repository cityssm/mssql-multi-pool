import type mssqlTypes from 'mssql';
/**
 * The driver that will be used.
 * - msnodesqlv8 on Windows (if available).
 * - tedious or all other operating systems.
 */
export declare const driver: string;
/**
 * Connect to a MSSQL database.
 * Creates a new connection if the configuration does not match a seen configuration.
 * @param config - MSSQL configuration.
 * @returns A MSSQL connection pool.
 */
export declare function connect(config: mssqlTypes.config): Promise<mssqlTypes.ConnectionPool>;
/**
 * Release all open connection pools.
 */
export declare function releaseAll(): Promise<void>;
/**
 * Retrieves the number of managed connection pools.
 * @returns The number of pools.
 */
export declare function getPoolCount(): number;
declare const _default: {
    connect: typeof connect;
    driver: string;
    getPoolCount: typeof getPoolCount;
    releaseAll: typeof releaseAll;
};
export default _default;
export * as mssql from 'mssql';
