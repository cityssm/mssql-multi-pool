import type { config as ConnectionPoolConfig } from '../index.js'

/*
 * SECRETS OK!
 * https://github.com/potatoqualitee/mssqlsuite
 */

export const config: ConnectionPoolConfig = {
  server: 'localhost',
  user: 'sa',
  password: 'dbatools.I0',
  database: 'master',
  options: {
    encrypt: false
  }
}
