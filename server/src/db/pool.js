import pg from 'pg';
import { config } from '../config/env.js';

const { Pool } = pg;
let pool = null;

// Lazily create and return the shared PostgreSQL connection pool.
export function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: config.databaseUrl });
  }
  return pool;
}

// Run a parameterized query against the pool.
export function query(text, params) {
  return getPool().query(text, params);
}
