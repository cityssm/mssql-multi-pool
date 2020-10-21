import { ConnectionPool } from "mssql";
import type { config as ConnectionPoolConfig } from "mssql";
export declare function connect(config: ConnectionPoolConfig): Promise<ConnectionPool>;
