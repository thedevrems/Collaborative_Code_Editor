import { useEffect, useState } from 'react';

// Read the list of connected users from the shared awareness states.
function collectUsers(awareness) {
  const users = [];
  awareness.getStates().forEach((state, clientId) => {
    if (state.user) {
      users.push({ ...state.user, clientId });
    }
  });
  return users;
}

// Track the connected users of a room via its awareness instance.
export function usePresence(connection) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!connection) {
      return undefined;
    }
    const { awareness } = connection;
    const sync = () => setUsers(collectUsers(awareness));
    sync();
    awareness.on('change', sync);
    return () => awareness.off('change', sync);
  }, [connection]);

  return users;
}
