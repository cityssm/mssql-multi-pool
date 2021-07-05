import mssql from "mssql";

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


export const connect = async (config: mssql.config) => {

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

      const shutdownEvents = ["beforeExit", "exit", "SIGINT", "SIGTERM"];

      for (const shutdownEvent of shutdownEvents) {

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        process.on(shutdownEvent, releaseAll);
      }
    }

    shutdownInitialized = true;
  }

  return pool;
};


export const releaseAll = () => {

  debugSQL("Releasing " + Object.getOwnPropertyNames(POOLS).length.toString() + " pools.");

  for (const poolKey of Object.getOwnPropertyNames(POOLS)) {

    debugSQL("Releasing pool: " + poolKey);

    POOLS[poolKey].close().catch();

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete POOLS[poolKey];
  }
};
