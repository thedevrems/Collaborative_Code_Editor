import Redis from 'ioredis';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

let client = null;

// Lazily create and return the shared Redis client.
export function getRedis() {
  if (!client) {
    client = new Redis(config.redisUrl, { maxRetriesPerRequest: 2 });
    client.on('error', (error) => logger.error(`redis error: ${error.message}`));
  }
  return client;
}
