import { useCallback, useState } from "react";

type UndoRedoHandler<T> = () => T | null;

type UseUndoableStackReturnValue<T = any> = {
  append: (value: T) => void;
  undo: UndoRedoHandler<T>;
  redo: UndoRedoHandler<T>;
};

export const useUndoableStack = <T = any>(
  initialValue: T
): UseUndoableStackReturnValue<T> => {
  const [undoStack, setUndoStack] = useState<T[]>([initialValue]);
  const [redoStack, setRedoStack] = useState<T[]>([]);

  const append = useCallback((value: T) => {
    setUndoStack((stack) => [...stack, value]);
    setRedoStack([]);
  }, []);

  const undo = useCallback<UndoRedoHandler<T>>(() => {
    if (undoStack.length < 2) {
      return null;
    }

    const undoValue = undoStack[undoStack.length - 2];
    const redoValue = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, undoStack.length - 1));
    setRedoStack([...redoStack, redoValue]);

    return undoValue;
  }, [redoStack, undoStack]);

  const redo = useCallback<UndoRedoHandler<T>>(() => {
    if (redoStack.length === 0) {
      return null;
    }

    const redoValue = redoStack[redoStack.length - 1];
    setUndoStack([...undoStack, redoValue]);
    setRedoStack(redoStack.slice(0, redoStack.length - 1));

    return redoValue;
  }, [redoStack, undoStack]);

  return { append, undo, redo };
};
