import * as Y from 'yjs';

const docs = new Map();

// Get the shared Y.Doc for a room, creating it on first access.
export function getDoc(roomId) {
  if (!docs.has(roomId)) {
    docs.set(roomId, new Y.Doc());
  }
  return docs.get(roomId);
}

// Drop a room's document from memory.
export function removeDoc(roomId) {
  docs.get(roomId)?.destroy();
  docs.delete(roomId);
}

// Iterate over all active room documents as [roomId, doc] entries.
export function allDocs() {
  return docs.entries();
}

// Encode the document state as an update diff relative to a state vector.
export function encodeDocState(doc, stateVector) {
  return Y.encodeStateAsUpdate(doc, stateVector);
}

// Encode the document's current state vector.
export function encodeDocStateVector(doc) {
  return Y.encodeStateVector(doc);
}

// Apply a remote update to the document with a tagged origin.
export function applyDocUpdate(doc, update, origin) {
  Y.applyUpdate(doc, update, origin);
}

// Load a persisted snapshot into a room document.
export function loadSnapshot(roomId, snapshot) {
  const doc = getDoc(roomId);
  Y.applyUpdate(doc, snapshot, 'snapshot');
  return doc;
}
