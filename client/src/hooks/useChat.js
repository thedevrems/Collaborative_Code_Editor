import { useEffect, useState } from 'react';
import { ROOM_EVENTS } from '../lib/events.js';

// Manage chat messages and history for a room connection.
export function useChat(connection) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!connection) {
      return undefined;
    }
    const { socket, roomId } = connection;
    const onHistory = (payload) => setMessages(payload.messages ?? []);
    const onMessage = (payload) =>
      setMessages((current) => [...current, payload.message]);
    socket.on(ROOM_EVENTS.CHAT_HISTORY, onHistory);
    socket.on(ROOM_EVENTS.CHAT_MESSAGE, onMessage);
    socket.emit(ROOM_EVENTS.CHAT_HISTORY, { roomId });
    return () => {
      socket.off(ROOM_EVENTS.CHAT_HISTORY, onHistory);
      socket.off(ROOM_EVENTS.CHAT_MESSAGE, onMessage);
    };
  }, [connection]);

  // Send a chat message to the room.
  function send(text) {
    if (text.trim()) {
      connection?.socket.emit(ROOM_EVENTS.CHAT_MESSAGE, {
        roomId: connection.roomId,
        text,
      });
    }
  }

  return { messages, send };
}
