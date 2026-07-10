import { query } from '../db/pool.js';

// Insert a room row, ignoring duplicates.
export async function insertRoom(room) {
  await query(
    `INSERT INTO rooms (id, language, created_at, updated_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
    [room.id, room.language, room.createdAt, room.updatedAt]
  );
  return room;
}

// Find a room row by its identifier.
export async function findRoomById(id) {
  const { rows } = await query(
    `SELECT id, language,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
     FROM rooms WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}
