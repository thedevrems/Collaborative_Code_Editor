import LanguageSelector from './LanguageSelector.jsx';

// Top bar showing the room, language selector and connection status.
export default function Toolbar({ roomId, language, onLanguageChange, connected }) {
  // Copy the current room URL to the clipboard.
  function copyLink() {
    navigator.clipboard?.writeText(window.location.href);
  }

  return (
    <header className="toolbar">
      <span className="toolbar-title">Room {roomId}</span>
      <LanguageSelector value={language} onChange={onLanguageChange} />
      <button className="toolbar-button" type="button" onClick={copyLink}>
        Copy link
      </button>
      <span className={connected ? 'status status-online' : 'status status-offline'}>
        {connected ? 'connected' : 'offline'}
      </span>
    </header>
  );
}
