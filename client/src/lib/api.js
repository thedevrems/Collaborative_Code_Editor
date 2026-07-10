import { SERVER_URL } from './constants.js';

// Parse a fetch response and throw on non-2xx status codes.
async function parse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error ?? `request_failed_${response.status}`);
  }
  return body;
}

// Create a new room, optionally with an initial language.
export async function createRoom(language) {
  const response = await fetch(`${SERVER_URL}/api/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language }),
  });
  return parse(response);
}

// Fetch an existing room by identifier.
export async function fetchRoom(id) {
  const response = await fetch(`${SERVER_URL}/api/rooms/${id}`);
  return parse(response);
}

// Fetch the ordered playback frames of a room's edit history.
export async function fetchPlayback(id) {
  const response = await fetch(`${SERVER_URL}/api/rooms/${id}/playback`);
  return parse(response);
}
