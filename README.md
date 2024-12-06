# mssql-multi-pool

[![npm](https://img.shields.io/npm/v/@cityssm/mssql-multi-pool)](https://www.npmjs.com/package/@cityssm/mssql-multi-pool)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/mssql-multi-pool)](https://codeclimate.com/github/cityssm/mssql-multi-pool/maintainability)
[![codecov](https://codecov.io/gh/cityssm/mssql-multi-pool/branch/main/graph/badge.svg?token=865Y3ZDNMC)](https://codecov.io/gh/cityssm/mssql-multi-pool)
[![Coverage Testing](https://github.com/cityssm/mssql-multi-pool/actions/workflows/coverage.yml/badge.svg)](https://github.com/cityssm/mssql-multi-pool/actions/workflows/coverage.yml)
[![DeepSource](https://app.deepsource.com/gh/cityssm/mssql-multi-pool.svg/?label=active+issues&show_trend=true&token=4Yz1B7bqP-sZ50AZnjXpoEos)](https://app.deepsource.com/gh/cityssm/mssql-multi-pool/)

A simple way to manage connections to multiple SQL Server databases using the Node.js Tedious package ([node-mssql](https://github.com/tediousjs/node-mssql)).

- 💪 Fully typed. Exports all types from node-mssql as well.
- 🧠 Automatically uses the [MSNodeSQLv8 driver](https://www.npmjs.com/package/msnodesqlv8)
  on Windows to support Windows authentication,
  and the [Tedious driver](https://www.npmjs.com/package/tedious) on other operating systems.
- 🧹 Automatically cleans up all pools on exit.

## Why?

The fantastic [node-mssql](https://github.com/tediousjs/node-mssql) package
provides an easy and reliable way to connect to _one_ SQL Server instance.

Connecting to multiple SQL Server instances is where things get trickier.
Not too tricky, but it is more involved as you can't rely on the global pool.
There is some sample code in the [node-mssql README](https://github.com/tediousjs/node-mssql) that shows how to do it.

This project implements that sample code. 👌

## Installation

```sh
npm install @cityssm/mssql-multi-pool
```

## Usage

Replace the `connect(config)` command from the `mssql` package
with the `connect(config)` command from the `@cityssm/mssql-multi-pool` package.

If the configuration object describes an unseen database, a new pool is made.
Otherwise, the previously made pool is used.

```typescript
import mssqlMultiPool, { type mssql } from '@cityssm/mssql-multi-pool'

const pool = await mssqlMultiPool.connect(config)

// Use the `mssql` package like before.

const results = (await pool
  .request()
  .input('workOrderNumber', '2024-01234')
  .query(
    'select * from WorkOrders where workOrderNumber = @workOrderNumber'
  )) as mssql.IResult<WorkOrder>
```
