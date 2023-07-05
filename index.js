import debug from 'debug';
import exitHook from 'exit-hook';
import mssql from 'mssql';
const debugSQL = debug('mssql-multi-pool:index');
const POOLS = new Map();
function getPoolKey(config) {
    var _a, _b, _c, _d;
    return (((_a = config.user) !== null && _a !== void 0 ? _a : '') +
        '@' +
        config.server +
        '/' +
        ((_c = (_b = config.options) === null || _b === void 0 ? void 0 : _b.instanceName) !== null && _c !== void 0 ? _c : '') +
        ';' +
        ((_d = config.database) !== null && _d !== void 0 ? _d : ''));
}
let shutdownInitialized = false;
export const connect = async (config) => {
    const poolKey = getPoolKey(config);
    let pool = POOLS.get(poolKey);
    if (pool === undefined || !pool.connected) {
        debugSQL('New database connection: ' + poolKey);
        pool = await new mssql.ConnectionPool(config).connect();
        POOLS.set(poolKey, pool);
    }
    if (!shutdownInitialized) {
        debugSQL('Initializing shutdown hooks.');
        exitHook(releaseAll);
        shutdownInitialized = true;
    }
    return pool;
};
export const releaseAll = () => {
    debugSQL('Releasing ' + POOLS.size.toString() + ' pools.');
    for (const poolKey of POOLS.keys()) {
        debugSQL('Releasing pool: ' + poolKey);
        try {
            const pool = POOLS.get(poolKey);
            if (pool !== undefined) {
                void pool.close();
            }
        }
        catch (_a) {
        }
    }
    POOLS.clear();
};
export const getPoolCount = () => {
    return POOLS.size;
};
