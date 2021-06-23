"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mssqlMultiPool = require("../index.js");
const debug_1 = require("debug");
const debugTest = debug_1.default("mssql-multi-pool:test");
let configFile;
try {
    configFile = require("./config.local.js");
    debugTest("Using config.local.js");
}
catch (_e) {
    configFile = require("./config.appveyor.js");
    debugTest("Using config.appveyor.js");
}
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
