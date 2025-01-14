import type mssqlTypes from 'mssql';
/**
 * The debug namespace for this package.
 */
export declare const DEBUG_NAMESPACE = "mssql-multi-pool";
/**
 * The debug namespaces string to enable debug output for this package.
 */
export declare const DEBUG_ENABLE_NAMESPACES = "mssql-multi-pool:*";
/**
 * The driver that will be used.
 * - msnodesqlv8 on Windows.
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
    driver: string;
    connect: typeof connect;
    releaseAll: typeof releaseAll;
    getPoolCount: typeof getPoolCount;
};
export default _default;
export * as mssql from 'mssql';
/**
 * @deprecated - Use `mssql` export.
 */
export type * as mssqlTypes from 'mssql';
