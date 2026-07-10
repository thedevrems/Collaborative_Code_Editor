import { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';

// Collaborative Monaco editor bound to the room's shared Yjs text.
export default function Editor({ connection, language }) {
  const bindingRef = useRef(null);

  // Bind the Monaco model to the Yjs text once the editor is mounted.
  function handleMount(editor) {
    if (!connection) {
      return;
    }
    bindingRef.current = new MonacoBinding(
      connection.text,
      editor.getModel(),
      new Set([editor]),
      connection.awareness ?? null
    );
  }

  return (
    <div className="editor">
      <MonacoEditor
        height="100%"
        theme="vs-dark"
        language={language}
        onMount={handleMount}
        options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
      />
    </div>
  );
}
