import { EVENTS } from './events.js';
import { buildUser } from '../utils/identity.js';
import { getRoom } from '../rooms/room.service.js';
import {
  addPresence,
  removePresence,
  listPresence,
  roomsForSocket,
  forgetSocket,
} from './presence.js';
import { logger } from '../utils/logger.js';

// Add a socket to a room and broadcast the updated presence.
function handleJoin(io, socket, payload = {}) {
  const roomId = payload.roomId;
  if (!roomId || !getRoom(roomId)) {
    socket.emit(EVENTS.ERROR, { error: 'room_not_found' });
    return;
  }
  const user = buildUser(payload.user);
  socket.join(roomId);
  addPresence(roomId, socket.id, user);
  socket.emit(EVENTS.ROOM_JOINED, { roomId, user, members: listPresence(roomId) });
  socket.to(roomId).emit(EVENTS.PRESENCE_JOINED, { roomId, user });
  socket.emit(EVENTS.PRESENCE_LIST, { roomId, members: listPresence(roomId) });
}

// Remove a socket from a single room and notify remaining members.
function leaveRoom(io, socket, roomId) {
  const user = removePresence(roomId, socket.id);
  socket.leave(roomId);
  if (user) {
    socket.to(roomId).emit(EVENTS.PRESENCE_LEFT, { roomId, user });
  }
}

// Handle an explicit leave request from a client.
function handleLeave(io, socket, payload = {}) {
  if (payload.roomId) {
    leaveRoom(io, socket, payload.roomId);
  }
}

// Clean up every room a socket belonged to when it disconnects.
function handleDisconnect(io, socket) {
  for (const roomId of roomsForSocket(socket.id)) {
    leaveRoom(io, socket, roomId);
  }
  forgetSocket(socket.id);
  logger.info(`socket disconnected: ${socket.id}`);
}

// Register realtime room event handlers on a connected socket.
export function registerRoomHandlers(io, socket) {
  socket.on(EVENTS.ROOM_JOIN, (payload) => handleJoin(io, socket, payload));
  socket.on(EVENTS.ROOM_LEAVE, (payload) => handleLeave(io, socket, payload));
  socket.on('disconnect', () => handleDisconnect(io, socket));
}
