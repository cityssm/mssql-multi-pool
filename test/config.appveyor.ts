import type { config as ConnectionPoolConfig } from "mssql";


/*
 * SECRETS OK!
 * https://www.appveyor.com/docs/getting-started-with-appveyor-for-linux/#sql-server-2017-for-linux
 */

export const config: ConnectionPoolConfig = {
  "user": "SA",
  "password": "Password12!",
  "server": "localhost"
};
