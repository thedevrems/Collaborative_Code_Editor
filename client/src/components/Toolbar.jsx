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
      <h1 className="toolbar-title">Room {roomId}</h1>
      <LanguageSelector value={language} onChange={onLanguageChange} />
      <button
        className="btn btn-secondary"
        type="button"
        onClick={undo?.undo}
        disabled={!undo?.canUndo}
      >
        Undo
      </button>
      <button
        className="btn btn-secondary"
        type="button"
        onClick={undo?.redo}
        disabled={!undo?.canRedo}
      >
        Redo
      </button>
      <button className="btn btn-primary" type="button" onClick={onRun} disabled={running}>
        {running ? 'Running…' : 'Run'}
      </button>
      <button className="btn btn-secondary" type="button" onClick={copyLink}>
        Copy link
      </button>
      <Link className="btn btn-secondary" to={`/room/${roomId}/playback`}>
        Playback
      </Link>
      <b className={connected ? 'status status-online' : 'status status-offline'}>
        <i className="badge-dot" aria-hidden="true" />
        {connected ? 'connected' : 'offline'}
      </b>
    </header>
  );
}
