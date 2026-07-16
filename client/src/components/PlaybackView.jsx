import { useParams, Link } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import { usePlayback } from '../hooks/usePlayback.js';
import '../styles/playback.css';

// Read-only screen that replays a room's edit history frame by frame.
export default function PlaybackView() {
  const { id } = useParams();
  const { frames, index, setIndex, playing, togglePlay } = usePlayback(id);
  const current = frames[index];

  return (
    <>
      <header className="playback-bar">
        <h1 className="sr-only">Session playback</h1>
        <Link className="btn btn-secondary" to={`/room/${id}`}>
          Back to room
        </Link>
        <button className="btn btn-secondary" type="button" onClick={togglePlay} disabled={!frames.length}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min="0"
          max={Math.max(frames.length - 1, 0)}
          value={index}
          aria-label="Playback position"
          onChange={(event) => setIndex(Number(event.target.value))}
        />
        <output className="playback-counter">
          {frames.length ? `${index + 1} / ${frames.length}` : 'no history'}
        </output>
      </header>
      <main id="main" className="playback-body">
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language="javascript"
          value={current?.code ?? ''}
          options={{ readOnly: true, minimap: { enabled: false }, automaticLayout: true }}
        />
      </main>
    </>
  );
}
