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
    <div className="playback">
      <header className="playback-bar">
        <Link className="toolbar-button" to={`/room/${id}`}>
          Back to room
        </Link>
        <button className="toolbar-button" type="button" onClick={togglePlay} disabled={!frames.length}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min="0"
          max={Math.max(frames.length - 1, 0)}
          value={index}
          onChange={(event) => setIndex(Number(event.target.value))}
        />
        <span className="playback-counter">
          {frames.length ? `${index + 1} / ${frames.length}` : 'no history'}
        </span>
      </header>
      <main className="playback-body">
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language="javascript"
          value={current?.code ?? ''}
          options={{ readOnly: true, minimap: { enabled: false }, automaticLayout: true }}
        />
      </main>
    </div>
  );
}
