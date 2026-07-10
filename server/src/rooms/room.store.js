const rooms = new Map();

// Persist a room entity in the in-memory store.
export function saveRoom(room) {
  rooms.set(room.id, room);
  return room;
}

// Retrieve a room entity by its identifier.
export function findRoom(id) {
  return rooms.get(id) ?? null;
}

// Report whether a room with the given identifier exists.
export function roomExists(id) {
  return rooms.has(id);
}
