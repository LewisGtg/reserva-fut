import { registerAs } from '@nestjs/config';

type AppConfig = {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  secretKey: string | undefined;
};

/**
 * Centralized configuration object that normalizes environment variables.
 */
export default registerAs<AppConfig>('app', () => ({
  nodeEnv: process.env.NODE_ENV?.trim() || 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? 'file:./dev.db',
  secretKey: process.env.SECRET_KEY,
}));
