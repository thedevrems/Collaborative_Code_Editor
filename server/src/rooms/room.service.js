import { nanoid } from 'nanoid';
import { config } from '../config/env.js';
import { createRoomEntity } from './room.model.js';
import { insertRoom, findRoomById } from '../persistence/room.repository.js';
import { insertSession } from '../persistence/session.repository.js';

const ROOM_ID_LENGTH = 10;

// Create a new room, persist it and open its first session.
export async function createRoom(language) {
  const room = createRoomEntity(nanoid(ROOM_ID_LENGTH), language);
  await insertRoom(room);
  await insertSession(room.id);
  return room;
}

// Fetch an existing room by identifier from the database.
export async function getRoom(id) {
  return findRoomById(id);
}

// Build the shareable client URL that points to a given room.
export function generateShareLink(id) {
  return `${config.clientOrigin}/room/${id}`;
}
