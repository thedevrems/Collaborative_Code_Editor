import { Router } from 'express';
import { getHealth } from './health.controller.js';

// Build the router exposing the health check endpoint.
export function createHealthRouter() {
  const router = Router();
  router.get('/health', getHealth);
  return router;
}
