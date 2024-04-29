import Debug from 'debug'
import exitHook from 'exit-hook'
import mssql from 'mssql'

const debug = Debug('mssql-multi-pool:index')

let shutdownIsInitialized = false
const POOLS = new Map<string, mssql.ConnectionPool>()

function getPoolKey(config: mssql.config): string {
  return `${config.user ?? ''}@${config.server}/${
    config.options?.instanceName ?? ''
  };${config.database ?? ''}`
}

/**
 * Connect to a MSSQL database.
 * Creates a new connection if the configuration does not match a previously seen configuration.
 * @param {mssql.config} config - MSSQL configuration.
 * @returns {mssql.ConnectionPool} - A MSSQL connection pool.
 */
export async function connect(
  config: mssql.config
): Promise<mssql.ConnectionPool> {
  const poolKey = getPoolKey(config)

  let pool = POOLS.get(poolKey)

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (pool === undefined || !pool.connected) {
    debug(`New database connection: ${poolKey}`)

    pool = await new mssql.ConnectionPool(config).connect()
    POOLS.set(poolKey, pool)
  }

  return pool
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
 * Retrieves the number of currently managed connection pools.
 * @returns {number} - The number of pools.
 */
export function getPoolCount(): number {
  return POOLS.size
}

/**
 * Initialize shutdown.
 */
if (!shutdownIsInitialized) {
  debug('Initializing shutdown hooks.')

  exitHook(() => {
    debug('Running shutdown hooks.')
    void releaseAll()
  })

  shutdownIsInitialized = true
}

export default {
  connect,
  releaseAll,
  getPoolCount
}

export type {
  ConnectionPool,
  IRecordSet,
  IResult,
  Transaction,
  config
} from 'mssql'
