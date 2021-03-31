"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseAll = exports.connect = void 0;
const mssql_1 = require("mssql");
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
const connect = async (config) => {
    const poolKey = getPoolKey(config);
    let pool = POOLS[poolKey];
    if (!pool || !pool.connected) {
        pool = await (new mssql_1.ConnectionPool(config)).connect();
        POOLS[poolKey] = pool;
    }
    if (!shutdownInitialized) {
        if (process) {
            const shutdownEvents = ["beforeExit", "exit", "SIGINT", "SIGTERM"];
            for (const shutdownEvent of shutdownEvents) {
                process.on(shutdownEvent, exports.releaseAll);
            }
        }
        shutdownInitialized = true;
    }
    return pool;
};
exports.connect = connect;
const releaseAll = async () => {
    for (const poolKey of Object.getOwnPropertyNames(POOLS)) {
        await POOLS[poolKey].close().catch();
        delete POOLS[poolKey];
    }
};
exports.releaseAll = releaseAll;
