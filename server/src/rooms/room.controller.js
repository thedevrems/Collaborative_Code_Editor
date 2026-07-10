import { createRoom, getRoom, generateShareLink } from './room.service.js';

// Handle room creation and return the room with its share link.
export async function postRoom(req, res) {
  const room = await createRoom(req.body?.language);
  res.status(201).json({ room, shareLink: generateShareLink(room.id) });
}

// Handle fetching a single room by identifier.
export async function getRoomById(req, res) {
  const room = await getRoom(req.params.id);
  if (!room) {
    res.status(404).json({ error: 'room_not_found' });
    return;
  }
  res.json({ room, shareLink: generateShareLink(room.id) });
}

// Handle share-link generation for an existing room.
export async function getRoomShareLink(req, res) {
  if (!(await getRoom(req.params.id))) {
    res.status(404).json({ error: 'room_not_found' });
    return;
  }
  res.json({ shareLink: generateShareLink(req.params.id) });
}
