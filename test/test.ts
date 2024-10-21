import assert from 'node:assert'
import { after, describe, it } from 'node:test'

import mssqlMultiPool from '../index.js'

import { config } from './test.config.js'

await describe('mssql-multi-pool', async () => {
  after(() => {
    void mssqlMultiPool.releaseAll()
  })

  await it('Connects to database', async () => {
    const pool = await mssqlMultiPool.connect(config)

    await pool.request().query('select 1')

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
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

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    assert.strictEqual(mssqlMultiPool.getPoolCount(), 0)
  })
})
