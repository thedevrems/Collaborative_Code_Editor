import { EVENTS } from '../realtime/events.js';
import {
  getDoc,
  encodeDocState,
  encodeDocStateVector,
  applyDocUpdate,
} from './doc-manager.js';
import { ensureRoomLoaded } from '../persistence/snapshot.service.js';

// Coerce socket.io binary payloads into a Uint8Array.
function toBytes(payload) {
  return payload instanceof Uint8Array ? payload : new Uint8Array(payload);
}

// Answer a client sync step 1 with a diff and our own state vector.
async function handleSyncStep1(socket, payload) {
  const { roomId, stateVector } = payload ?? {};
  if (!roomId) {
    return;
  }
  await ensureRoomLoaded(roomId);
  const doc = getDoc(roomId);
  const update = encodeDocState(doc, toBytes(stateVector));
  socket.emit(EVENTS.CRDT_SYNC_STEP2, { roomId, update });
  socket.emit(EVENTS.CRDT_SYNC_STEP1, {
    roomId,
    stateVector: encodeDocStateVector(doc),
  });
}

// Apply an incoming update to the room document and relay it to peers.
function applyAndRelay(socket, payload) {
  const { roomId, update } = payload ?? {};
  if (!roomId || !update) {
    return;
  }
  const doc = getDoc(roomId);
  applyDocUpdate(doc, toBytes(update), socket.id);
  socket.to(roomId).emit(EVENTS.CRDT_UPDATE, { roomId, update });
}

// Relay an awareness update to the other members of the room.
function relayAwareness(socket, payload) {
  const { roomId, update } = payload ?? {};
  if (!roomId || !update) {
    return;
  }
  socket.to(roomId).emit(EVENTS.CRDT_AWARENESS, { roomId, update });
}

// Register CRDT synchronization handlers on a connected socket.
export function registerCrdtHandlers(io, socket) {
  socket.on(EVENTS.CRDT_SYNC_STEP1, (payload) =>
    handleSyncStep1(socket, payload)
  );
  socket.on(EVENTS.CRDT_SYNC_STEP2, (payload) => applyAndRelay(socket, payload));
  socket.on(EVENTS.CRDT_UPDATE, (payload) => applyAndRelay(socket, payload));
  socket.on(EVENTS.CRDT_AWARENESS, (payload) => relayAwareness(socket, payload));
}
