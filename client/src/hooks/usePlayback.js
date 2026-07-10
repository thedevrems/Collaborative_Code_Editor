import { useEffect, useRef, useState } from 'react';
import { fetchPlayback } from '../lib/api.js';

const FRAME_INTERVAL_MS = 1200;

// Load a room's playback frames and manage playback position and state.
export function usePlayback(roomId) {
  const [frames, setFrames] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    fetchPlayback(roomId)
      .then((data) => setFrames(data.frames ?? []))
      .catch(() => setFrames([]));
  }, [roomId]);

  useEffect(() => {
    if (!playing) {
      return undefined;
    }
    timer.current = setInterval(() => {
      setIndex((current) => {
        if (current >= frames.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, FRAME_INTERVAL_MS);
    return () => clearInterval(timer.current);
  }, [playing, frames.length]);

  return {
    frames,
    index,
    setIndex,
    playing,
    togglePlay: () => setPlaying((value) => !value),
  };
}
