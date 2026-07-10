import { query } from '../db/pool.js';

// Start a new editing session for a room and return its id.
export async function insertSession(roomId) {
  const { rows } = await query(
    'INSERT INTO sessions (room_id) VALUES ($1) RETURNING id',
    [roomId]
  );
  return rows[0].id;
}
