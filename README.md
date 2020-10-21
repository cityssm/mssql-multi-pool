# mssql-multi-pool

[![npm](https://badgen.net/npm/v/@cityssm/mssql-multi-pool)](https://www.npmjs.com/package/@cityssm/mssql-multi-pool)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/19dbca72690940f69b2b96fe045575db)](https://www.codacy.com/gh/cityssm/mssql-multi-pool/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cityssm/mssql-multi-pool&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/9796c8879e5341d9a1b0/maintainability)](https://codeclimate.com/github/cityssm/mssql-multi-pool/maintainability)

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
