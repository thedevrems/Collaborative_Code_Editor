// Sidebar listing the users currently connected to the room.
export default function UserList({ users }) {
  return (
    <aside className="user-list">
      <h2 className="user-list-title">Users ({users.length})</h2>
      <ul>
        {users.map((user) => (
          <li key={user.clientId} className="user-item">
            <span className="user-dot" style={{ background: user.color }} />
            {user.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
