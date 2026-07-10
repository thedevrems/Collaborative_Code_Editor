import { useParams } from 'react-router-dom';
import Toolbar from './Toolbar.jsx';
import Editor from './Editor.jsx';
import { useRoomConnection } from '../hooks/useRoomConnection.js';
import { useSharedLanguage } from '../hooks/useSharedLanguage.js';

// Full room screen wiring the toolbar and collaborative editor together.
export default function RoomView() {
  const { id } = useParams();
  const { connection, connected } = useRoomConnection(id);
  const { language, changeLanguage } = useSharedLanguage(connection);

  return (
    <div className="room">
      <Toolbar
        roomId={id}
        language={language}
        onLanguageChange={changeLanguage}
        connected={connected}
      />
      <main className="room-body">
        <Editor connection={connection} language={language} />
      </main>
    </div>
  );
}
