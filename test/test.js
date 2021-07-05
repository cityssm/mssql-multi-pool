import assert from "assert";
import * as mssqlMultiPool from "../index.js";
import * as configFile from "./config.test.js";
describe("mssql-multi-pool", () => {
    after(() => {
        mssqlMultiPool.releaseAll();
    });
    it("Connects to database", async () => {
        const pool = await mssqlMultiPool.connect(configFile.config);
        await pool.request()
            .query("select 1");
        assert.ok(true);
    });
    it("Connects to database again", async () => {
        const pool = await mssqlMultiPool.connect(configFile.config);
        await pool.request()
            .query("select 1");
        assert.ok(true);
    });
});
