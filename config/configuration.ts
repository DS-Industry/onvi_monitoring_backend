import * as process from 'process';

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.APP_PORT, 10) || 5001,
  appName: process.env.APP_NAME,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  smsUrl: process.env.BEELINE_URL,
  loginSms: process.env.BEELINE_LOGIN,
  passwordSms: process.env.BEELINE_PSWD,
  senderSms: process.env.BEELINE_SENDER,
  emailUrl: process.env.EMAIL_URL,
  emailApiKey: process.env.EMAIL_API_KEY,
  emailName: process.env.EMAIL_NAME,
  emailFrom: process.env.EMAIL_FROM,
  bucketName: process.env.BUCKET_NAME,
});
