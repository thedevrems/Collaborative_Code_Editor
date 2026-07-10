import * as Y from 'yjs';
import { listSnapshots } from '../persistence/snapshot.repository.js';

// Decode a snapshot's bytes into its stored code text.
function decode(data) {
  const doc = new Y.Doc();
  Y.applyUpdate(doc, new Uint8Array(data));
  const code = doc.getText('code').toString();
  doc.destroy();
  return code;
}

// Build ordered playback frames from a room's stored snapshots.
export async function getPlaybackFrames(roomId) {
  const rows = await listSnapshots(roomId);
  return rows.map((row, index) => ({
    index,
    ts: row.createdAt,
    code: decode(row.data),
  }));
}
