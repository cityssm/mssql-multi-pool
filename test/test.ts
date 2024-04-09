import assert from 'node:assert'
import { after, describe, it } from 'node:test'

import { connect, getPoolCount, releaseAll } from '../index.js'

import { config } from './config.test.js'

await describe('mssql-multi-pool', async () => {
  after(async () => {
    await releaseAll()
  })

  await it('Connects to database', async () => {
    const pool = await connect(config)

    await pool.request().query('select 1')

    assert.strictEqual(getPoolCount(), 1)
  })

  await it('Connects to database again', async () => {
    const poolCountStart = getPoolCount()

    const pool = await connect(config)

    await pool.request().query('select 1')

    assert.strictEqual(getPoolCount(), poolCountStart)
  })

  await it('Releases all pools', async () => {
    await releaseAll()

    assert.strictEqual(getPoolCount(), 0)
  })
})
