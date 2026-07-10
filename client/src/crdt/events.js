export const CRDT_EVENTS = {
  SYNC_STEP1: 'crdt:sync-step1',
  SYNC_STEP2: 'crdt:sync-step2',
  UPDATE: 'crdt:update',
};

// Coerce a socket.io binary payload into a Uint8Array.
export function toBytes(payload) {
  return payload instanceof Uint8Array ? payload : new Uint8Array(payload);
}
