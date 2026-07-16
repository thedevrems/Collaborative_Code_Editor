import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../lib/api.js';

// Landing screen to create a new room or join an existing one.
export default function HomeView() {
  const navigate = useNavigate();
  const [joinId, setJoinId] = useState('');
  const [error, setError] = useState('');

  // Create a room on the server and navigate into it.
  async function handleCreate() {
    try {
      const { room } = await createRoom();
      navigate(`/room/${room.id}`);
    } catch {
      setError('Could not create room');
    }
  }

  // Navigate into an existing room by its identifier.
  function handleJoin(event) {
    event.preventDefault();
    if (joinId.trim()) {
      navigate(`/room/${joinId.trim()}`);
    }
  }

  return (
    <main id="main" className="home">
      <h1>Collaborative Code Editor</h1>
      <button className="btn btn-primary" type="button" onClick={handleCreate}>
        Create a room
      </button>
      <form className="join-row" onSubmit={handleJoin}>
        <input
          value={joinId}
          placeholder="Room id"
          aria-label="Room id"
          onChange={(event) => setJoinId(event.target.value)}
        />
        <button className="btn btn-secondary" type="submit">
          Join
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </main>
  );
}
