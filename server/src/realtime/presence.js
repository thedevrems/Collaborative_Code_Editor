const roomPresence = new Map();
const socketRooms = new Map();

// Ensure a presence map exists for a room and return it.
function ensureRoom(roomId) {
  if (!roomPresence.has(roomId)) {
    roomPresence.set(roomId, new Map());
  }
  return roomPresence.get(roomId);
}

// Register a user's presence in a room for a given socket.
export function addPresence(roomId, socketId, user) {
  ensureRoom(roomId).set(socketId, { ...user, socketId });
  if (!socketRooms.has(socketId)) {
    socketRooms.set(socketId, new Set());
  }
  socketRooms.get(socketId).add(roomId);
  return roomPresence.get(roomId).get(socketId);
}

// Remove a socket's presence from a room and drop empty rooms.
export function removePresence(roomId, socketId) {
  const members = roomPresence.get(roomId);
  if (!members) {
    return null;
  }
  const user = members.get(socketId) ?? null;
  members.delete(socketId);
  socketRooms.get(socketId)?.delete(roomId);
  if (members.size === 0) {
    roomPresence.delete(roomId);
  }
  return user;
}

// List the users currently present in a room.
export function listPresence(roomId) {
  const members = roomPresence.get(roomId);
  return members ? [...members.values()] : [];
}

// Return the set of rooms a socket has joined.
export function roomsForSocket(socketId) {
  return [...(socketRooms.get(socketId) ?? [])];
}

// Forget all bookkeeping tied to a disconnected socket.
export function forgetSocket(socketId) {
  socketRooms.delete(socketId);
}
