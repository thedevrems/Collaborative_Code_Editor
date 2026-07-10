import { nanoid } from 'nanoid';
import { config } from '../config/env.js';
import { createRoomEntity } from './room.model.js';
import { saveRoom, findRoom } from './room.store.js';

const ROOM_ID_LENGTH = 10;

// Create a new room with a unique identifier and store it.
export function createRoom(language) {
  const room = createRoomEntity(nanoid(ROOM_ID_LENGTH), language);
  return saveRoom(room);
}

// Fetch an existing room by identifier.
export function getRoom(id) {
  return findRoom(id);
}

// Build the shareable client URL that points to a given room.
export function generateShareLink(id) {
  return `${config.clientOrigin}/room/${id}`;
}
