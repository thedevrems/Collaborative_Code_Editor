import { Router } from 'express';
import {
  postRoom,
  getRoomById,
  getRoomShareLink,
} from './room.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

// Build the router exposing the room management endpoints.
export function createRoomRouter() {
  const router = Router();
  router.post('/rooms', asyncHandler(postRoom));
  router.get('/rooms/:id', asyncHandler(getRoomById));
  router.get('/rooms/:id/share-link', asyncHandler(getRoomShareLink));
  return router;
}
