import { getPlaybackFrames } from './playback.service.js';

// Handle fetching the ordered playback frames of a room.
export async function getPlayback(req, res) {
  const frames = await getPlaybackFrames(req.params.id);
  res.json({ frames });
}
