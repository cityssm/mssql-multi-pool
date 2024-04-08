import debug from 'debug'
import exitHook from 'exit-hook'
import mssql from 'mssql'

const debugSQL = debug('mssql-multi-pool:index')

const POOLS = new Map<string, mssql.ConnectionPool>()

function getPoolKey(config: mssql.config): string {
  return `${config.user ?? ''}@${config.server}/${
    config.options?.instanceName ?? ''
  };${config.database ?? ''}`
}

let shutdownInitialized = false

/**
 * Connect to a MSSQL database.
 * Creates a new connection if the configuration does not match a previously seen configuration.
 * @param {mssql.config} config - MSSQL configuration.
 * @returns {mssql.ConnectionPool} - A MSSQL connection pool.
 */
export async function connect(
  config: mssql.config
): Promise<mssql.ConnectionPool> {
  if (!shutdownInitialized) {
    debugSQL('Initializing shutdown hooks.')

    exitHook(() => {
      void releaseAll()
    })

    shutdownInitialized = true
  }

  const poolKey = getPoolKey(config)

  let pool = POOLS.get(poolKey)

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (pool === undefined || !pool.connected) {
    debugSQL(`New database connection: ${poolKey}`)

    pool = await new mssql.ConnectionPool(config).connect()
    POOLS.set(poolKey, pool)
  }

  return pool
}

/**
 * Release all open connection pools.
 */
export async function releaseAll(): Promise<void> {
  debugSQL(`Releasing ${POOLS.size.toString()} pools.`)

  for (const poolKey of POOLS.keys()) {
    debugSQL(`Releasing pool: ${poolKey}`)

    try {
      const pool = POOLS.get(poolKey)
      if (pool !== undefined) {
        await pool.close()
      }
    } catch {
      debugSQL('Error closing connections.')
    }
  }

  POOLS.clear()
}

/**
 * Retrieves the number of currently managed connection pools.
 * @returns {number} - The number of pools.
 */
export function getPoolCount(): number {
  return POOLS.size
}

export default {
  connect,
  releaseAll,
  getPoolCount
}

export type {
  config,
  IRecordSet,
  IResult,
  Transaction
} from 'mssql'
