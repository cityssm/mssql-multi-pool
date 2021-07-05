import mssql from "mssql";
import debug from "debug";
const debugSQL = debug("mssql-multi-pool:index");
const POOLS = {};
const getPoolKey = (config) => {
    var _a;
    return (config.user || "") +
        "@" +
        config.server +
        "/" +
        (((_a = config.options) === null || _a === void 0 ? void 0 : _a.instanceName) || "");
};
let shutdownInitialized = false;
export const connect = async (config) => {
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
        delete POOLS[poolKey];
    }
};
