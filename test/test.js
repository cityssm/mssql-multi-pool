"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mssqlMultiPool = require("../index.js");
let configFile;
try {
    configFile = require("./config.local.js");
    console.log("Using config.local.js");
}
catch (_e) {
    configFile = require("./config.appveyor.js");
    console.log("Using config.appveyor.js");
}
describe("mssql-multi-pool", () => {
    after(async () => {
        await mssqlMultiPool.releaseAll();
    });
    it("Connects to database", async () => {
        const pool = await mssqlMultiPool.connect(configFile.config);
        await pool.request()
            .query("select 1");
        assert.ok(true);
    });
});
