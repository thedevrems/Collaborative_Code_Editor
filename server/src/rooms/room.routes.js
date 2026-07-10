import { Router } from 'express';
import {
  postRoom,
  getRoomById,
  getRoomShareLink,
} from './room.controller.js';

// Build the router exposing the room management endpoints.
export function createRoomRouter() {
  const router = Router();
  router.post('/rooms', postRoom);
  router.get('/rooms/:id', getRoomById);
  router.get('/rooms/:id/share-link', getRoomShareLink);
  return router;
}
