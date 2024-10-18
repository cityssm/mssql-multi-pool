import Debug from 'debug'
import exitHook from 'exit-hook'
import msNodeSql from 'mssql/msnodesqlv8.js'

const debug = Debug('mssql-multi-pool:index')

const POOLS = new Map<string, msNodeSql.ConnectionPool>()

function getPoolKey(config: msNodeSql.config): string {
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
  config: msNodeSql.config
): Promise<msNodeSql.ConnectionPool> {

  const poolKey = getPoolKey(config)

  let pool = POOLS.get(poolKey)

  if (!(pool?.connected ?? false)) {
    debug(`New database connection: ${poolKey}`)

    pool = new msNodeSql.ConnectionPool(config)

    await pool.connect()

    POOLS.set(poolKey, pool)
  }

  return pool as msNodeSql.ConnectionPool
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
  connect,
  releaseAll,
  getPoolCount
}

export * as mssql from 'mssql/msnodesqlv8.js'

export type {
  Bit,
  BigInt,
  Decimal,
  Float,
  Int,
  Money,
  Numeric,
  SmallInt,
  SmallMoney,
  Real,
  TinyInt,
  Char,
  NChar,
  Text,
  NText,
  VarChar,
  NVarChar,
  Xml,
  Time,
  Date,
  DateTime,
  DateTime2,
  DateTimeOffset,
  SmallDateTime,
  UniqueIdentifier,
  Variant,
  Binary,
  VarBinary,
  Image,
  UDT,
  Geography,
  Geometry,
  TYPES,
  ConnectionPool,
  Transaction,
  IColumnMetadata,
  IRecordSet,
  IResult,
  ISqlType,
  config
} from 'mssql/msnodesqlv8.js'
