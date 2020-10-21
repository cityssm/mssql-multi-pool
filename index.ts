import { ConnectionPool } from "mssql";
import type { config as ConnectionPoolConfig } from "mssql";


const POOLS: { [poolKey: string]: ConnectionPool } = {};


function getPoolKey(config: ConnectionPoolConfig) {

  return (config.user || "") +
    "@" +
    config.server +
    "/" +
    (config.options?.instanceName || "");
}


export async function connect(config: ConnectionPoolConfig) {

  const poolKey = getPoolKey(config);

  if (!POOLS[poolKey]) {
    const pool = await (new ConnectionPool(config)).connect();
    POOLS[poolKey] = pool;
  }

  return POOLS[poolKey];
}
