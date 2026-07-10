import { useParams } from 'react-router-dom';
import Toolbar from './Toolbar.jsx';
import Editor from './Editor.jsx';
import UserList from './UserList.jsx';
import OutputPanel from './OutputPanel.jsx';
import { useRoomConnection } from '../hooks/useRoomConnection.js';
import { useSharedLanguage } from '../hooks/useSharedLanguage.js';
import { usePresence } from '../hooks/usePresence.js';
import { useExecution } from '../hooks/useExecution.js';

// Full room screen wiring editor, presence, cursors and code execution.
export default function RoomView() {
  const { id } = useParams();
  const { connection, connected } = useRoomConnection(id);
  const { language, changeLanguage } = useSharedLanguage(connection);
  const users = usePresence(connection);
  const { running, result, run } = useExecution(connection, language);

  return (
    <div className="room">
      <Toolbar
        roomId={id}
        language={language}
        onLanguageChange={changeLanguage}
        connected={connected}
        onRun={run}
        running={running}
      />
      <main className="room-body">
        <div className="editor-column">
          <Editor connection={connection} language={language} />
          <OutputPanel running={running} result={result} />
        </div>
        <UserList users={users} />
      </main>
    </div>
  );
}
