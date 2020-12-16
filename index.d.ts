import { ConnectionPool } from "mssql";
import type { config as ConnectionPoolConfig } from "mssql";
export declare const connect: (config: ConnectionPoolConfig) => Promise<ConnectionPool>;
export declare const releaseAll: () => Promise<void>;
