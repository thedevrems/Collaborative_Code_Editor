import { nanoid } from 'nanoid';

const COLORS = [
  '#e6194b', '#3cb44b', '#4363d8', '#f58231',
  '#911eb4', '#42d4f4', '#f032e6', '#bfef45',
];

// Pick a deterministic color from the palette based on an identifier.
function colorFor(id) {
  let hash = 0;
  for (const char of id) {
    hash = (hash + char.charCodeAt(0)) % COLORS.length;
  }
  return COLORS[hash];
}

// Build a normalized user identity from a client payload.
export function buildUser(payload = {}) {
  const id = typeof payload.id === 'string' && payload.id ? payload.id : nanoid(8);
  const name =
    typeof payload.name === 'string' && payload.name.trim()
      ? payload.name.trim().slice(0, 32)
      : `guest-${id.slice(0, 4)}`;
  const color = typeof payload.color === 'string' ? payload.color : colorFor(id);
  return { id, name, color };
}
