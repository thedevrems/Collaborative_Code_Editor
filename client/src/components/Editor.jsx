import { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import * as Y from 'yjs';

// Collaborative Monaco editor bound to the room's shared Yjs text.
export default function Editor({ connection, language, onReady }) {
  const bindingRef = useRef(null);

  // Bind the Monaco model to the Yjs text and expose an undo manager.
  function handleMount(editor) {
    if (!connection) {
      return;
    }
    const binding = new MonacoBinding(
      connection.text,
      editor.getModel(),
      new Set([editor]),
      connection.awareness ?? null
    );
    bindingRef.current = binding;
    const undoManager = new Y.UndoManager(connection.text, {
      trackedOrigins: new Set([binding]),
    });
    onReady?.(undoManager);
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
