import { useEffect, useState } from 'react';
import { RoomConnection } from '../lib/room-connection.js';
import { getLocalUser } from '../lib/user.js';

// Manage a RoomConnection instance tied to a component's lifecycle.
export function useRoomConnection(roomId) {
  const [connection, setConnection] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const instance = new RoomConnection(roomId, getLocalUser()).connect();
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    instance.socket.on('connect', onConnect);
    instance.socket.on('disconnect', onDisconnect);
    setConnection(instance);
    return () => {
      instance.socket.off('connect', onConnect);
      instance.socket.off('disconnect', onDisconnect);
      instance.disconnect();
      setConnection(null);
      setConnected(false);
    };
  }, [roomId]);

  return { connection, connected };
}
