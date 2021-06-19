import React, { createContext, useState } from "react";
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
  setPaints: React.Dispatch<React.SetStateAction<Drawing[]>>;
  append: (drawing: Drawing[]) => void;
  undo: () => Drawing[] | null;
  redo: () => Drawing[] | null;
};

export const PaintStackContext = createContext<PaintStackContextValue>({
  paints: [],
  /* eslint-disable @typescript-eslint/no-empty-function */
  setPaints: () => {},
  append: () => {},
  undo: () => [],
  redo: () => [],
  /* eslint-enable @typescript-eslint/no-empty-function */
});

export const PaintStackContextProvider: React.FC = ({ children }) => {
  const [paints, setPaints] = useState<Drawing[]>([]);
  const { append, undo, redo } = useUndoableStack<Drawing[]>([]);

  return (
    <PaintStackContext.Provider
      value={{ paints, setPaints, append, undo, redo }}
    >
      {children}
    </PaintStackContext.Provider>
  );
};
