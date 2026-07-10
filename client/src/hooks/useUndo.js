import { useEffect, useState } from 'react';

// Expose undo/redo actions and availability for a Yjs undo manager.
export function useUndo(undoManager) {
  const [state, setState] = useState({ canUndo: false, canRedo: false });

  useEffect(() => {
    if (!undoManager) {
      return undefined;
    }
    const sync = () =>
      setState({
        canUndo: undoManager.undoStack.length > 0,
        canRedo: undoManager.redoStack.length > 0,
      });
    sync();
    undoManager.on('stack-item-added', sync);
    undoManager.on('stack-item-popped', sync);
    return () => {
      undoManager.off('stack-item-added', sync);
      undoManager.off('stack-item-popped', sync);
    };
  }, [undoManager]);

  return {
    canUndo: state.canUndo,
    canRedo: state.canRedo,
    undo: () => undoManager?.undo(),
    redo: () => undoManager?.redo(),
  };
}
