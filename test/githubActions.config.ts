import type { mssql } from '../index.js'

/*
 * SECRETS OK!
 * https://github.com/potatoqualitee/mssqlsuite
 */

export const config: mssql.config = {
  server: 'localhost',
  user: 'sa',

  // eslint-disable-next-line sonarjs/no-hardcoded-passwords
  password: 'dbatools.I0',
  database: 'master',
  options: {
    encrypt: false
  }
}
