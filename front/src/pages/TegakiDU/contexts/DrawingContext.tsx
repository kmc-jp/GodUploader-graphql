import Konva from "konva";
import React, { useCallback, useRef, useState } from "react";

type DrawingContextValue = {
  color: string;
  backgroundColor: string;
  strokeWidth: number;
  stageRef: React.Ref<Konva.Stage>;
  setColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  toBlob: () => Promise<Blob | null>;
};

const defaultDrawingContextValue = {
  color: "black",
  backgroundColor: "white",
  strokeWidth: 2,
  stageRef: null,
  /* eslint-disable @typescript-eslint/no-empty-function*/
  setColor: () => {},
  setBackgroundColor: () => {},
  setStrokeWidth: () => {},
  toBlob: async () => null,
  /* eslint-enable @typescript-eslint/no-empty-function*/
};

export const DrawingContext = React.createContext<DrawingContextValue>(
  defaultDrawingContextValue
);

export const DrawingProvider: React.FC = ({ children }) => {
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const stageRef = useRef<Konva.Stage>(null);
  const toBlob = useCallback(async () => {
    if (!stageRef.current) {
      return null;
    }

    const canvas = stageRef.current.toCanvas();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b))
    );

    return blob;
  }, []);

  return (
    <DrawingContext.Provider
      value={{
        color,
        backgroundColor,
        strokeWidth,
        stageRef,
        setColor,
        setBackgroundColor,
        setStrokeWidth,
        toBlob,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};
