import { useEffect, useState } from 'react';
import { ROOM_EVENTS } from '../lib/events.js';

// Manage code execution requests and results for a room connection.
export function useExecution(connection, language) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!connection) {
      return undefined;
    }
    const { socket } = connection;
    const onStarted = () => setRunning(true);
    const onResult = (payload) => {
      setRunning(false);
      setResult(payload);
    };
    socket.on(ROOM_EVENTS.EXEC_STARTED, onStarted);
    socket.on(ROOM_EVENTS.EXEC_RESULT, onResult);
    return () => {
      socket.off(ROOM_EVENTS.EXEC_STARTED, onStarted);
      socket.off(ROOM_EVENTS.EXEC_RESULT, onResult);
    };
  }, [connection]);

  // Ask the server to run the room's current code.
  function run() {
    connection?.socket.emit(ROOM_EVENTS.EXEC_RUN, {
      roomId: connection.roomId,
      language,
    });
  }

  return { running, result, run };
}
