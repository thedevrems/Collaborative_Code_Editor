import * as Y from 'yjs';
import { getDoc, allDocs } from '../crdt/doc-manager.js';
import { saveSnapshot, latestSnapshot } from './snapshot.repository.js';
import { logger } from '../utils/logger.js';

const SNAPSHOT_INTERVAL_MS = 10000;
const EMPTY_UPDATE_SIZE = 2;
const loaded = new Map();

// Apply the most recent stored snapshot to a room's document.
async function loadSnapshotInto(roomId) {
  const data = await latestSnapshot(roomId);
  if (data) {
    Y.applyUpdate(getDoc(roomId), new Uint8Array(data), 'snapshot');
  }
}

// Load the latest persisted snapshot into a room document exactly once.
export function ensureRoomLoaded(roomId) {
  if (!loaded.has(roomId)) {
    loaded.set(roomId, loadSnapshotInto(roomId));
  }
  return loaded.get(roomId);
}

// Persist the current state of one room document when it is not empty.
async function saveDocSnapshot(roomId, doc) {
  const update = Y.encodeStateAsUpdate(doc);
  if (update.length > EMPTY_UPDATE_SIZE) {
    await saveSnapshot(roomId, Buffer.from(update));
  }
}

// Persist snapshots for every active room document.
async function snapshotAll() {
  for (const [roomId, doc] of allDocs()) {
    await saveDocSnapshot(roomId, doc).catch((error) =>
      logger.error(`snapshot failed for ${roomId}: ${error.message}`)
    );
  }
}

// Start the periodic snapshot persistence loop.
export function scheduleSnapshots() {
  setInterval(snapshotAll, SNAPSHOT_INTERVAL_MS);
}
