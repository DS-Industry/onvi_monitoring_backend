import * as process from 'process';

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  databaseUrl: process.env.DATABASE_URL,
});
