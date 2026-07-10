import { useState } from 'react';
import { useChat } from '../hooks/useChat.js';

// Room chat panel showing messages and a text input.
export default function ChatPanel({ connection }) {
  const { messages, send } = useChat(connection);
  const [draft, setDraft] = useState('');

  // Send the current draft and clear the input.
  function submit(event) {
    event.preventDefault();
    send(draft);
    setDraft('');
  }

  return (
    <section className="chat">
      <h2 className="chat-title">Chat</h2>
      <ul className="chat-messages">
        {messages.map((message) => (
          <li key={message.id} className="chat-message">
            <span className="chat-author" style={{ color: message.user.color }}>
              {message.user.name}
            </span>
            <span className="chat-text">{message.text}</span>
          </li>
        ))}
      </ul>
      <form className="chat-form" onSubmit={submit}>
        <input
          value={draft}
          placeholder="Message"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
