const history = new Map();
const MAX_MESSAGES = 100;

// Append a message to a room's capped in-memory history.
export function addMessage(roomId, message) {
  const list = history.get(roomId) ?? [];
  list.push(message);
  if (list.length > MAX_MESSAGES) {
    list.shift();
  }
  history.set(roomId, list);
  return message;
}

// Return the stored chat history for a room.
export function getHistory(roomId) {
  return history.get(roomId) ?? [];
}
