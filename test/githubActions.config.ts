import type { mssqlTypes } from '../index.js'

/*
 * SECRETS OK!
 * https://github.com/potatoqualitee/mssqlsuite
 */

export const config: mssqlTypes.config = {
  server: 'localhost',
  user: 'sa',
  // eslint-disable-next-line sonarjs/no-hardcoded-credentials
  password: 'dbatools.I0',
  database: 'master',
  options: {
    encrypt: false
  }
}
