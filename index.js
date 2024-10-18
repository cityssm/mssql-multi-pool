import Debug from 'debug';
import exitHook from 'exit-hook';
const mssqlImport = process.platform === 'win32'
    ? await import('mssql/msnodesqlv8.js')
    : await import('mssql');
export const mssql = mssqlImport.default;
const debug = Debug('mssql-multi-pool:index');
const POOLS = new Map();
function getPoolKey(config) {
    return `${config.user ?? ''}@${config.server}/${config.options?.instanceName ?? ''};${config.database ?? ''}`;
}
export async function connect(config) {
    const poolKey = getPoolKey(config);
    let pool = POOLS.get(poolKey);
    if (!(pool?.connected ?? false)) {
        debug(`New database connection: ${poolKey}`);
        pool = new mssql.ConnectionPool(config);
        await pool.connect();
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
debug('Initializing shutdown hooks.');
exitHook(() => {
    debug('Running shutdown hooks.');
    void releaseAll();
});
export default {
    connect,
    releaseAll,
    getPoolCount
};
