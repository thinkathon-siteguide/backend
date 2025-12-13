import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CORS_ORIGIN: z.string().default('*')
});

const envVars = envSchema.parse(process.env);

export const config = {
  env: envVars.NODE_ENV,
  port: parseInt(envVars.PORT, 10),
  mongo: {
    uri: envVars.MONGO_URI
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN
  },
  cors: {
    origin: envVars.CORS_ORIGIN
  }
};
