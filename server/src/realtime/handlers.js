import { EVENTS } from './events.js';
import { buildUser } from '../utils/identity.js';
import { getRoom } from '../rooms/room.service.js';
import {
  addPresence,
  removePresence,
  listPresence,
  roomsForSocket,
  forgetSocket,
} from '../state/room-state.js';
import { logger } from '../utils/logger.js';

// Add a socket to a room and broadcast the updated presence.
async function handleJoin(io, socket, payload = {}) {
  const roomId = payload.roomId;
  if (!roomId || !(await getRoom(roomId))) {
    socket.emit(EVENTS.ERROR, { error: 'room_not_found' });
    return;
  }
  const user = buildUser(payload.user);
  socket.data.user = user;
  socket.join(roomId);
  await addPresence(roomId, socket.id, user);
  const members = await listPresence(roomId);
  socket.emit(EVENTS.ROOM_JOINED, { roomId, user, members });
  socket.to(roomId).emit(EVENTS.PRESENCE_JOINED, { roomId, user });
  socket.emit(EVENTS.PRESENCE_LIST, { roomId, members });
}

// Remove a socket from a single room and notify remaining members.
async function leaveRoom(io, socket, roomId) {
  const user = await removePresence(roomId, socket.id);
  socket.leave(roomId);
  if (user) {
    socket.to(roomId).emit(EVENTS.PRESENCE_LEFT, { roomId, user });
  }
}

// Handle an explicit leave request from a client.
async function handleLeave(io, socket, payload = {}) {
  if (payload.roomId) {
    await leaveRoom(io, socket, payload.roomId);
  }
}

// Clean up every room a socket belonged to when it disconnects.
async function handleDisconnect(io, socket) {
  for (const roomId of await roomsForSocket(socket.id)) {
    await leaveRoom(io, socket, roomId);
  }
  await forgetSocket(socket.id);
  logger.info(`socket disconnected: ${socket.id}`);
}

// Register realtime room event handlers on a connected socket.
export function registerRoomHandlers(io, socket) {
  socket.on(EVENTS.ROOM_JOIN, (payload) => handleJoin(io, socket, payload));
  socket.on(EVENTS.ROOM_LEAVE, (payload) => handleLeave(io, socket, payload));
  socket.on('disconnect', () => handleDisconnect(io, socket));
}
