# mssql-multi-pool

[![npm](https://img.shields.io/npm/v/@cityssm/mssql-multi-pool)](https://www.npmjs.com/package/@cityssm/mssql-multi-pool) [![Codacy Badge](https://img.shields.io/codacy/grade/19dbca72690940f69b2b96fe045575db)](https://www.codacy.com/gh/cityssm/mssql-multi-pool/dashboard) [![Maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/mssql-multi-pool)](https://codeclimate.com/github/cityssm/mssql-multi-pool/maintainability) ![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/cityssm/mssql-multi-pool)

A simple way to manage connections to multiple SQL Server databases using the Node.js Tedious driver.

## Why?

The fantastic [node-mssql](https://github.com/tediousjs/node-mssql) package
provides an easy and reliable way to connect to _one_ SQL Server instance.

Connecting to multiple SQL Server instances is where things get trickier.
Not too tricky, but it is more involved as you can't rely on the global pool.
There is some sample code in the [node-mssql README](https://github.com/tediousjs/node-mssql) that shows how to do it.
This project implements that sample code.

## Installation

```bash
npm install @cityssm/mssql-multi-pool
```

## Usage

Replace the `connect(config);` command from the `mssql` package
with the `connect(config);` command from the `@cityssm/mssql-multi-pool` package.

If the configuration object describes an unseen database, a new pool is made.
Otherwise, the previously made pool is used.

```javascript
import * as sql from "@cityssm/mssql-multi-pool";

(async function () {
    try {
        let pool = await sql.connect(config);

        // Use the `mssql` package like before.

    } catch (e) {}
})();
```
