import Debug from 'debug'
import exitHook from 'exit-hook'
import type mssqlTypes from 'mssql'

/**
 * The debug namespace for this package.
 */
export const DEBUG_NAMESPACE = 'mssql-multi-pool'

/**
 * The debug namespaces string to enable debug output for this package.
 */
export const DEBUG_ENABLE_NAMESPACES = `${DEBUG_NAMESPACE}:*`

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

/**
 * The driver that will be used.
 * - msnodesqlv8 on Windows.
 * - tedious or all other operating systems.
 */
export const driver = process.platform === 'win32' ? 'msnodesqlv8' : 'tedious'

debug(`MSSQL driver: ${driver}`)

const mssqlImport =
  driver === 'msnodesqlv8'
    ? await import('mssql/msnodesqlv8.js')
    : await import('mssql')

const mssql = mssqlImport.default

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

export * as mssql from 'mssql'

/**
 * @deprecated - Use `mssql` export.
 */
export type * as mssqlTypes from 'mssql'
