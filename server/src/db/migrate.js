import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getPool } from './pool.js';
import { logger } from '../utils/logger.js';

const here = dirname(fileURLToPath(import.meta.url));

// Apply the database schema, creating tables if they do not exist.
export async function migrate() {
  const sql = await readFile(join(here, 'schema.sql'), 'utf8');
  await getPool().query(sql);
  logger.info('database schema ready');
}
