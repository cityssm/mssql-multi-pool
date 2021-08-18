import mssql from "mssql";
import exitHook from "exit-hook";

import debug from "debug";
const debugSQL = debug("mssql-multi-pool:index");


const POOLS: { [poolKey: string]: mssql.ConnectionPool } = {};


const getPoolKey = (config: mssql.config) => {

  return (config.user || "") +
    "@" +
    config.server +
    "/" +
    (config.options ?.instanceName || "");
};


let shutdownInitialized = false;


export const connect = async (config: mssql.config): Promise<mssql.ConnectionPool> => {

  const poolKey = getPoolKey(config);

  let pool = POOLS[poolKey];

  if (!pool || !pool.connected) {

    debugSQL("New database connection: " + poolKey);

    pool = await (new mssql.ConnectionPool(config)).connect();
    POOLS[poolKey] = pool;
  }

  if (!shutdownInitialized) {

    if (process) {
      debugSQL("Initializing shutdown hooks.");
      exitHook(releaseAll);
    }

    shutdownInitialized = true;
  }

  return pool;
};


export const releaseAll = (): void => {

  debugSQL("Releasing " + Object.getOwnPropertyNames(POOLS).length.toString() + " pools.");

  for (const poolKey of Object.getOwnPropertyNames(POOLS)) {

    debugSQL("Releasing pool: " + poolKey);

    try {
      POOLS[poolKey].close();
    } catch {
      // ignore
    }

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete POOLS[poolKey];
  }
};
