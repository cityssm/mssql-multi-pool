import assert from 'node:assert';
import { connect, getPoolCount, releaseAll } from '../index.js';
import { config } from './config.test.js';
describe('mssql-multi-pool', () => {
    after(() => {
        releaseAll();
    });
    it('Connects to database', async () => {
        const pool = await connect(config);
        await pool.request().query('select 1');
        assert.strictEqual(getPoolCount(), 1);
    });
    it('Connects to database again', async () => {
        const poolCountStart = getPoolCount();
        const pool = await connect(config);
        await pool.request().query('select 1');
        assert.strictEqual(getPoolCount(), poolCountStart);
    });
    it('Releases all pools', async () => {
        releaseAll();
        assert.strictEqual(getPoolCount(), 0);
    });
});
