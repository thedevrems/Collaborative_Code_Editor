import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector.jsx';

// Top bar showing the room, language selector, run action and status.
export default function Toolbar(props) {
  const { roomId, language, onLanguageChange, connected, onRun, running, undo } =
    props;

  // Copy the current room URL to the clipboard.
  function copyLink() {
    navigator.clipboard?.writeText(window.location.href);
  }

  return (
    <header className="toolbar">
      <span className="toolbar-title">Room {roomId}</span>
      <LanguageSelector value={language} onChange={onLanguageChange} />
      <button
        className="toolbar-button"
        type="button"
        onClick={undo?.undo}
        disabled={!undo?.canUndo}
      >
        Undo
      </button>
      <button
        className="toolbar-button"
        type="button"
        onClick={undo?.redo}
        disabled={!undo?.canRedo}
      >
        Redo
      </button>
      <button className="toolbar-button" type="button" onClick={onRun} disabled={running}>
        {running ? 'Running…' : 'Run'}
      </button>
      <button className="toolbar-button" type="button" onClick={copyLink}>
        Copy link
      </button>
      <Link className="toolbar-button" to={`/room/${roomId}/playback`}>
        Playback
      </Link>
      <span className={connected ? 'status status-online' : 'status status-offline'}>
        {connected ? 'connected' : 'offline'}
      </span>
    </header>
  );
}
