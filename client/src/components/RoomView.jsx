import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Toolbar from './Toolbar.jsx';
import Editor from './Editor.jsx';
import UserList from './UserList.jsx';
import OutputPanel from './OutputPanel.jsx';
import ChatPanel from './ChatPanel.jsx';
import { useRoomConnection } from '../hooks/useRoomConnection.js';
import { useSharedLanguage } from '../hooks/useSharedLanguage.js';
import { usePresence } from '../hooks/usePresence.js';
import { useExecution } from '../hooks/useExecution.js';
import { useUndo } from '../hooks/useUndo.js';

// Full room screen wiring editor, presence, cursors and code execution.
export default function RoomView() {
  const { id } = useParams();
  const { connection, connected } = useRoomConnection(id);
  const { language, changeLanguage } = useSharedLanguage(connection);
  const users = usePresence(connection);
  const { running, result, run } = useExecution(connection, language);
  const [undoManager, setUndoManager] = useState(null);
  const undo = useUndo(undoManager);

  // Toolbar is the banner; the workspace is a grid of editor, output and aside.
  return (
    <>
      <Toolbar
        roomId={id}
        language={language}
        onLanguageChange={changeLanguage}
        connected={connected}
        onRun={run}
        running={running}
        undo={undo}
      />
      <main id="main" className="room-body">
        <Editor
          connection={connection}
          language={language}
          onReady={setUndoManager}
        />
        <OutputPanel running={running} result={result} />
        <aside className="sidebar">
          <UserList users={users} />
          <ChatPanel connection={connection} />
        </aside>
      </main>
    </>
  );
}
