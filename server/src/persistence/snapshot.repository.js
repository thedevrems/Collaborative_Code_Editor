import { query } from '../db/pool.js';

// Persist a document snapshot for a room.
export async function saveSnapshot(roomId, data) {
  await query('INSERT INTO snapshots (room_id, data) VALUES ($1, $2)', [
    roomId,
    data,
  ]);
}

// Load the most recent snapshot bytes for a room.
export async function latestSnapshot(roomId) {
  const { rows } = await query(
    'SELECT data FROM snapshots WHERE room_id = $1 ORDER BY created_at DESC LIMIT 1',
    [roomId]
  );
  return rows[0]?.data ?? null;
}

// List every snapshot of a room in chronological order.
export async function listSnapshots(roomId) {
  const { rows } = await query(
    `SELECT data, created_at AS "createdAt"
     FROM snapshots WHERE room_id = $1 ORDER BY created_at ASC`,
    [roomId]
  );
  return rows;
}
