import assert from 'node:assert'
import { after, describe, it } from 'node:test'

import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js'
import mssqlMultiPool, { driver } from '../index.js'

import { config } from './test.config.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

const debug = Debug(`${DEBUG_NAMESPACE}:test`)

await describe('mssql-multi-pool', async () => {
  debug(`Using "${driver}" driver`)

  after(() => {
    void mssqlMultiPool.releaseAll()
  })

  await it('Connects to database', async () => {
    const pool = await mssqlMultiPool.connect(config)

    await pool.request().query('select 1')

    assert.strictEqual(mssqlMultiPool.getPoolCount(), 1)
  })

  await it('Connects to database again', async () => {
    const poolCountStart = mssqlMultiPool.getPoolCount()

    const pool = await mssqlMultiPool.connect(config)

    await pool.request().query('select 1')

    assert.strictEqual(mssqlMultiPool.getPoolCount(), poolCountStart)
  })

  await it('Releases all pools', async () => {
    await mssqlMultiPool.releaseAll()

    assert.strictEqual(mssqlMultiPool.getPoolCount(), 0)
  })
})
