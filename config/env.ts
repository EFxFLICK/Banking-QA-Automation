import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const parsePort = (name: string, fallback: string): number => {
  const value = Number(requiredEnv(name, fallback));

  if (!Number.isInteger(value) || value <= 0 || value > 65535) {
    throw new Error(`Invalid port configured for ${name}: ${value}`);
  }

  return value;
};

export const env = {
  uiBaseUrl: requiredEnv('BASE_URL', 'http://localhost:8080'),
  apiBaseUrl: requiredEnv('API_BASE_URL', 'http://localhost:8080'),
  dbHost: requiredEnv('DB_HOST', 'localhost'),
  dbPort: parsePort('DB_PORT', '9001'),
  dbName: requiredEnv('DB_NAME', 'parabank'),
  dbUser: requiredEnv('DB_USER', 'sa'),
  dbPassword: process.env.DB_PASSWORD ?? ''
} as const;
