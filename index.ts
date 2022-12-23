import mssql from "mssql";
import exitHook from "exit-hook";

import debug from "debug";
const debugSQL = debug("mssql-multi-pool:index");

const POOLS: Map<string, mssql.ConnectionPool> = new Map();

const getPoolKey = (config: mssql.config) => {
    return (
        (config.user || "") +
        "@" +
        config.server +
        "/" +
        (config.options?.instanceName || "") +
        ";" +
        (config.database || "")
    );
};

let shutdownInitialized = false;

export const connect = async (config: mssql.config): Promise<mssql.ConnectionPool> => {
    const poolKey = getPoolKey(config);

    let pool = POOLS.get(poolKey);

    if (!pool || !pool.connected) {
        debugSQL("New database connection: " + poolKey);

        pool = await new mssql.ConnectionPool(config).connect();
        POOLS.set(poolKey, pool);
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
    debugSQL("Releasing " + POOLS.size.toString() + " pools.");

    for (const poolKey of POOLS.keys()) {
        debugSQL("Releasing pool: " + poolKey);

        try {
            POOLS.get(poolKey).close();
        } catch {
            // ignore
        }
    }

    POOLS.clear();
};

export const getPoolCount = (): number => {
    return POOLS.size;
};
