import { logger } from '../utils/logger.js';

// Convert uncaught route errors into a JSON 500 response.
export function errorHandler(error, req, res, next) {
  logger.error(`request failed: ${error.message}`);
  res.status(500).json({ error: 'internal_error' });
}
