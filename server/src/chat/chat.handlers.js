import { nanoid } from 'nanoid';
import { EVENTS } from '../realtime/events.js';
import { addMessage, getHistory } from './chat.store.js';

const MAX_TEXT = 2000;

// Build a chat message from a socket's user and raw text.
function buildMessage(user, text) {
  return {
    id: nanoid(8),
    user,
    text: String(text).slice(0, MAX_TEXT),
    ts: Date.now(),
  };
}

// Handle an incoming chat message and broadcast it to the room.
function handleMessage(io, socket, payload = {}) {
  const { roomId, text } = payload;
  const user = socket.data.user;
  if (!roomId || !user || !text) {
    return;
  }
  const message = addMessage(roomId, buildMessage(user, text));
  io.to(roomId).emit(EVENTS.CHAT_MESSAGE, { roomId, message });
}

// Send the existing chat history to a socket that requests it.
function handleHistory(socket, payload = {}) {
  if (!payload.roomId) {
    return;
  }
  socket.emit(EVENTS.CHAT_HISTORY, {
    roomId: payload.roomId,
    messages: getHistory(payload.roomId),
  });
}

// Register chat handlers on a connected socket.
export function registerChatHandlers(io, socket) {
  socket.on(EVENTS.CHAT_MESSAGE, (payload) => handleMessage(io, socket, payload));
  socket.on(EVENTS.CHAT_HISTORY, (payload) => handleHistory(socket, payload));
}
