import { registerAs } from '@nestjs/config';

/**
 * Namespaced and partial registration for strong typing of config object
 */

export default registerAs('app', () => ({
  environmemt: process.env.NODE_ENV || 'development',
  mail: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 527,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },

  databse: {
    mongoUri: process.env.MONGO_URI,
    redisUri: process.env.MONGO_URI,
  },

  auth: {
    sessionSecret: process.env.SESSION_SECRET,
  },
}));
