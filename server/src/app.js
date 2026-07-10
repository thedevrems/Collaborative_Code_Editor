import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { createHealthRouter } from './http/health.routes.js';
import { createRoomRouter } from './rooms/room.routes.js';
import { errorHandler } from './http/error.middleware.js';

// Create and configure the Express application with base middleware and routes.
export function createApp() {
  const app = express();
  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json());
  app.use('/api', createHealthRouter());
  app.use('/api', createRoomRouter());
  app.use(errorHandler);
  return app;
}
