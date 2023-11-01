import debug from 'debug';
import exitHook from 'exit-hook';
import mssql from 'mssql';
const debugSQL = debug('mssql-multi-pool:index');
const POOLS = new Map();
function getPoolKey(config) {
    return `${config.user ?? ''}@${config.server}/${config.options?.instanceName ?? ''};${config.database ?? ''}`;
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
        catch {
        }
    }
    POOLS.clear();
};
export const getPoolCount = () => {
    return POOLS.size;
};
