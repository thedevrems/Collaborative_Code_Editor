import { EVENTS } from '../realtime/events.js';
import { getDoc } from '../crdt/doc-manager.js';
import { executeCode } from './execution.service.js';

// Read the current shared code of a room from its document.
function readRoomCode(roomId) {
  return getDoc(roomId).getText('code').toString();
}

// Run the room's code and broadcast the result to every member.
async function handleRun(io, socket, payload) {
  const { roomId, language } = payload ?? {};
  if (!roomId) {
    return;
  }
  io.to(roomId).emit(EVENTS.EXECUTION_STARTED, { roomId });
  const result = await executeCode(language, readRoomCode(roomId));
  io.to(roomId).emit(EVENTS.EXECUTION_RESULT, { roomId, ...result });
}

// Register code execution handlers on a connected socket.
export function registerExecutionHandlers(io, socket) {
  socket.on(EVENTS.EXECUTION_RUN, (payload) => handleRun(io, socket, payload));
}
