import mssql from "mssql";
import exitHook from "exit-hook";
import debug from "debug";
const debugSQL = debug("mssql-multi-pool:index");
const POOLS = new Map();
const getPoolKey = (config) => {
    var _a;
    return ((config.user || "") +
        "@" +
        config.server +
        "/" +
        (((_a = config.options) === null || _a === void 0 ? void 0 : _a.instanceName) || "") +
        ";" +
        (config.database || ""));
};
let shutdownInitialized = false;
export const connect = async (config) => {
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
export const releaseAll = () => {
    debugSQL("Releasing " + POOLS.size.toString() + " pools.");
    for (const poolKey of POOLS.keys()) {
        debugSQL("Releasing pool: " + poolKey);
        try {
            POOLS.get(poolKey).close();
        }
        catch (_a) {
        }
    }
    POOLS.clear();
};
export const getPoolCount = () => {
    return POOLS.size;
};
