import Debug from 'debug'
import exitHook from 'exit-hook'
import type mssqlTypes from 'mssql'

const debug = Debug('mssql-multi-pool:index')

export const driver = process.platform === 'win32' ? 'msnodesqlv8' : 'tedious'

debug(`MSSQL driver: ${driver}`)

const mssqlImport =
  driver === 'msnodesqlv8'
    ? await import('mssql/msnodesqlv8.js')
    : await import('mssql')

// eslint-disable-next-line @typescript-eslint/prefer-destructuring
export const mssql = mssqlImport.default

const POOLS = new Map<string, mssqlTypes.ConnectionPool>()

function getPoolKey(config: mssqlTypes.config): string {
  return `${config.user ?? ''}@${config.server}/${
    config.options?.instanceName ?? ''
  };${config.database ?? ''}`
}

/**
 * Connect to a MSSQL database.
 * Creates a new connection if the configuration does not match a seen configuration.
 * @param config - MSSQL configuration.
 * @returns A MSSQL connection pool.
 */
export async function connect(
  config: mssqlTypes.config
): Promise<mssqlTypes.ConnectionPool> {
  const poolKey = getPoolKey(config)

  let pool = POOLS.get(poolKey)

  if (!(pool?.connected ?? false)) {
    debug(`New database connection: ${poolKey}`)

    pool = new mssql.ConnectionPool(config)

    await pool.connect()

    POOLS.set(poolKey, pool)
  }

  return pool as mssqlTypes.ConnectionPool
}

/**
 * Release all open connection pools.
 */
export async function releaseAll(): Promise<void> {
  debug(`Releasing ${POOLS.size.toString()} pools.`)

  for (const poolKey of POOLS.keys()) {
    debug(`Releasing pool: ${poolKey}`)

    try {
      const pool = POOLS.get(poolKey)
      if (pool !== undefined) {
        await pool.close()
      }
    } catch {
      debug('Error closing connections.')
    }
  }

  POOLS.clear()
}

/**
 * Retrieves the number of managed connection pools.
 * @returns The number of pools.
 */
export function getPoolCount(): number {
  return POOLS.size
}

/**
 * Initialize shutdown.
 */

debug('Initializing shutdown hooks.')

exitHook(() => {
  debug('Running shutdown hooks.')
  void releaseAll()
})

/*
 * Exports
 */

export default {
  driver,
  connect,
  releaseAll,
  getPoolCount
}
