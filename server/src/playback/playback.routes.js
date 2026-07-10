import { Router } from 'express';
import { getPlayback } from './playback.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

// Build the router exposing the session playback endpoint.
export function createPlaybackRouter() {
  const router = Router();
  router.get('/rooms/:id/playback', asyncHandler(getPlayback));
  return router;
}
