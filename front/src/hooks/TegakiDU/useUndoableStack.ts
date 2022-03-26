import { useCallback, useState } from "react";

type UndoRedoHandler<T> = () => T | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseUndoableStackReturnValue<T = any> = {
  append: (value: T) => void;
  undo: UndoRedoHandler<T>;
  redo: UndoRedoHandler<T>;
  undoable: boolean;
  redoable: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUndoableStack = <T = any>(
  initialValue: T
): UseUndoableStackReturnValue<T> => {
  const [undoStack, setUndoStack] = useState<T[]>([initialValue]);
  const [redoStack, setRedoStack] = useState<T[]>([]);

  const undoable = undoStack.length >= 2;
  const redoable = redoStack.length > 0;

  const append = useCallback((value: T) => {
    setUndoStack((stack) => [...stack, value]);
    setRedoStack([]);
  }, []);

  const undo = useCallback<UndoRedoHandler<T>>(() => {
    if (!undoable) {
      return null;
    }

    const undoValue = undoStack[undoStack.length - 2];
    const redoValue = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, undoStack.length - 1));
    setRedoStack([...redoStack, redoValue]);

    return undoValue;
  }, [redoStack, undoStack, undoable]);

  const redo = useCallback<UndoRedoHandler<T>>(() => {
    if (!redoable) {
      return null;
    }

    const redoValue = redoStack[redoStack.length - 1];
    setUndoStack([...undoStack, redoValue]);
    setRedoStack(redoStack.slice(0, redoStack.length - 1));

    return redoValue;
  }, [redoStack, redoable, undoStack]);

  return { append, undo, redo, undoable, redoable };
};
