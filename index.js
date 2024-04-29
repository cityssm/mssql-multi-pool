import Debug from 'debug';
import exitHook from 'exit-hook';
import mssql from 'mssql';
const debug = Debug('mssql-multi-pool:index');
let shutdownIsInitialized = false;
const POOLS = new Map();
function getPoolKey(config) {
    return `${config.user ?? ''}@${config.server}/${config.options?.instanceName ?? ''};${config.database ?? ''}`;
}
export async function connect(config) {
    const poolKey = getPoolKey(config);
    let pool = POOLS.get(poolKey);
    if (pool === undefined || !pool.connected) {
        debug(`New database connection: ${poolKey}`);
        pool = await new mssql.ConnectionPool(config).connect();
        POOLS.set(poolKey, pool);
    }
    return pool;
}
export async function releaseAll() {
    debug(`Releasing ${POOLS.size.toString()} pools.`);
    for (const poolKey of POOLS.keys()) {
        debug(`Releasing pool: ${poolKey}`);
        try {
            const pool = POOLS.get(poolKey);
            if (pool !== undefined) {
                await pool.close();
            }
        }
        catch {
            debug('Error closing connections.');
        }
    }
    POOLS.clear();
}
export function getPoolCount() {
    return POOLS.size;
}
if (!shutdownIsInitialized) {
    debug('Initializing shutdown hooks.');
    exitHook(() => {
        debug('Running shutdown hooks.');
        void releaseAll();
    });
    shutdownIsInitialized = true;
}
export default {
    connect,
    releaseAll,
    getPoolCount
};
