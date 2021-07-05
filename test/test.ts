import assert from "assert";
import * as mssqlMultiPool from "../index.js";

import type { config as ConnectionPoolConfig } from "mssql";

import debug from "debug";
const debugTest = debug("mssql-multi-pool:test");


let configFile: { config: ConnectionPoolConfig };

try {
  configFile = require("./config.local.js");
  debugTest("Using config.local.js");
} catch (_e) {
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
