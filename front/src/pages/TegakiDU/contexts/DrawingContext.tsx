import React, { useState } from "react";

type DrawingContextValue = {
  color: string;
  backgroundColor: string;
  strokeWidth: number;
  setColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
};

const defaultDrawingContextValue = {
  color: "black",
  backgroundColor: "white",
  strokeWidth: 2,
  /* eslint-disable @typescript-eslint/no-empty-function*/
  setColor: () => {},
  setBackgroundColor: () => {},
  setStrokeWidth: () => {},
  /* eslint-enable @typescript-eslint/no-empty-function*/
};

export const DrawingContext = React.createContext<DrawingContextValue>(
  defaultDrawingContextValue
);

export const DrawingProvider: React.FC = ({ children }) => {
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);

  return (
    <DrawingContext.Provider
      value={{
        color,
        backgroundColor,
        strokeWidth,
        setColor,
        setBackgroundColor,
        setStrokeWidth,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};
