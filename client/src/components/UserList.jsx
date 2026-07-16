// Sidebar listing the users currently connected to the room.
export default function UserList({ users }) {
  return (
    <section className="user-list">
      <h2 className="user-list-title">Users ({users.length})</h2>
      <ul>
        {users.map((user) => (
          <li key={user.clientId} className="user-item">
            <i className="user-dot" style={{ background: user.color }} aria-hidden="true" />
            {user.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
