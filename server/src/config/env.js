import dotenv from 'dotenv';

dotenv.config();

// Parse an integer environment variable with a fallback default.
function readInt(name, fallback) {
  const value = Number.parseInt(process.env[name] ?? '', 10);
  return Number.isNaN(value) ? fallback : value;
}

// Read a string environment variable with a fallback default.
function readString(name, fallback) {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

export const config = {
  nodeEnv: readString('NODE_ENV', 'development'),
  port: readInt('PORT', 4000),
  clientOrigin: readString('CLIENT_ORIGIN', 'http://localhost:5173'),
  redisUrl: readString('REDIS_URL', 'redis://localhost:6379'),
  databaseUrl: readString(
    'DATABASE_URL',
    'postgres://editor:editor@localhost:5432/editor'
  ),
};
