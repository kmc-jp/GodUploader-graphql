import React, { createContext, useCallback, useState } from "react";
import { useUndoableStack } from "../hooks/useUndoableStack";

type Point = number[];

type Drawing = {
  tool: "pen";
  strokeWidth: number;
  color: string;
  points: Point;
};

type PaintStackContextValue = {
  paints: Drawing[];
  undoable: boolean;
  redoable: boolean;
  setPaints: React.Dispatch<React.SetStateAction<Drawing[]>>;
  append: (drawing: Drawing[]) => void;
  undo: () => void;
  redo: () => void;
};

export const PaintStackContext = createContext<PaintStackContextValue>({
  paints: [],
  undoable: false,
  redoable: false,
  /* eslint-disable @typescript-eslint/no-empty-function */
  setPaints: () => {},
  append: () => {},
  undo: () => {},
  redo: () => {},
  /* eslint-enable @typescript-eslint/no-empty-function */
});

export const PaintStackContextProvider: React.FC = ({ children }) => {
  const [paints, setPaints] = useState<Drawing[]>([]);
  const {
    append,
    undo: undoStack,
    redo: redoStack,
    undoable,
    redoable,
  } = useUndoableStack<Drawing[]>([]);

  const undo = useCallback(() => {
    const undoValue = undoStack();
    if (undoValue) {
      setPaints(undoValue);
    }
  }, [undoStack]);

  const redo = useCallback(() => {
    const redoValue = redoStack();
    if (redoValue) {
      setPaints(redoValue);
    }
  }, [redoStack]);

  return (
    <PaintStackContext.Provider
      value={{ paints, setPaints, append, undo, redo, undoable, redoable }}
    >
      {children}
    </PaintStackContext.Provider>
  );
};
