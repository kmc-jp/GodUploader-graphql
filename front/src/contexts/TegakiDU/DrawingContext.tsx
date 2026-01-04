import Konva from "konva";
import React, { useCallback, useRef, useState } from "react";

type DrawingContextValue = {
  color: string;
  backgroundColor: string;
  strokeWidth: number;
  stageRef: React.Ref<Konva.Stage>;
  isPosting: boolean;
  setColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setIsPosting: (isPosing: boolean) => void;
  toBlob: () => Promise<Blob | null>;
};

const defaultDrawingContextValue = {
  color: "black",
  backgroundColor: "white",
  strokeWidth: 2,
  stageRef: null,
  isPosting: false,

  setColor: () => {},
  setBackgroundColor: () => {},
  setStrokeWidth: () => {},
  setIsPosting: () => {},
  toBlob: async () => null,
};

export const DrawingContext = React.createContext<DrawingContextValue>(
  defaultDrawingContextValue
);

interface DrawingProviderProps {
  children: React.ReactNode;
}

export const DrawingProvider: React.VFC<DrawingProviderProps> = ({
  children,
}) => {
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const stageRef = useRef<Konva.Stage>(null);
  const [isPosting, setIsPosting] = useState(false);
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
        isPosting,
        setColor,
        setBackgroundColor,
        setStrokeWidth,
        toBlob,
        setIsPosting,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};
