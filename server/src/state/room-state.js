import { getRedis } from './redis.js';

const ROOM_TTL = 3600;

// Build the Redis hash key holding a room's members.
function membersKey(roomId) {
  return `room:${roomId}:members`;
}

// Build the Redis set key holding the rooms a socket has joined.
function socketKey(socketId) {
  return `socket:${socketId}:rooms`;
}

// Register a user's presence in a room and refresh the room TTL.
export async function addPresence(roomId, socketId, user) {
  const redis = getRedis();
  const stored = { ...user, socketId };
  await redis.hset(membersKey(roomId), socketId, JSON.stringify(stored));
  await redis.sadd(socketKey(socketId), roomId);
  await redis.expire(membersKey(roomId), ROOM_TTL);
  return stored;
}

// Remove a socket's presence from a room and drop it when empty.
export async function removePresence(roomId, socketId) {
  const redis = getRedis();
  const raw = await redis.hget(membersKey(roomId), socketId);
  await redis.hdel(membersKey(roomId), socketId);
  await redis.srem(socketKey(socketId), roomId);
  if ((await redis.hlen(membersKey(roomId))) === 0) {
    await redis.del(membersKey(roomId));
  }
  return raw ? JSON.parse(raw) : null;
}

// List the users currently present in a room.
export async function listPresence(roomId) {
  const values = await getRedis().hvals(membersKey(roomId));
  return values.map((value) => JSON.parse(value));
}

// Return the rooms a socket has joined.
export async function roomsForSocket(socketId) {
  return getRedis().smembers(socketKey(socketId));
}

// Forget all room membership bookkeeping for a socket.
export async function forgetSocket(socketId) {
  await getRedis().del(socketKey(socketId));
}
