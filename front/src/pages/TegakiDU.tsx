import { KonvaEventObject } from "konva/lib/Node";
import React, { useContext, useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import { useMeasure } from "react-use";

type DrawingContextValue = {
  color: string;
  backgroundColor: string;
  setColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
};

const defaultDrawingContextValue = {
  color: "black",
  backgroundColor: "white",
  /* eslint-disable @typescript-eslint/no-empty-function*/
  setColor: () => {},
  setBackgroundColor: () => {},
  /* eslint-enable @typescript-eslint/no-empty-function*/
};

const DrawingContext = React.createContext<DrawingContextValue>(
  defaultDrawingContextValue
);

const DrawingProvider: React.FC = ({ children }) => {
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  return (
    <DrawingContext.Provider
      value={{
        color,
        backgroundColor,
        setColor,
        setBackgroundColor,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

type Point = number[];

type Drawing = {
  tool: "pen";
  color: string;
  points: Point;
};

const Canvas: React.VFC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const { color } = useContext(DrawingContext);
  const [lines, setLines] = useState<Drawing[]>([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) {
      return;
    }
    const pos = stage.getPointerPosition();
    if (!pos) {
      return;
    }

    isDrawing.current = true;
    setLines([...lines, { tool: "pen", color, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    if (!stage) {
      return;
    }
    const point = stage.getPointerPosition();
    if (!point) {
      return;
    }

    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Stage
      width={width}
      height={height}
      className="border border-dark"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke={line.color}
            lineCap="round"
          />
        ))}
      </Layer>
    </Stage>
  );
};

const Sidebar: React.VFC = () => {
  const { color, setColor, backgroundColor, setBackgroundColor } =
    useContext(DrawingContext);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-100 h-100"
          />
        </div>
        <div className="col">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-100 h-100"
          />
        </div>
      </div>
    </div>
  );
};

export const TegakiDU: React.VFC = () => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">TEGAKI Draw and Upload</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <DrawingProvider>
              <div className="col-md-8" style={{ height: 482 }} ref={ref}>
                <Canvas width={width} height={height} />
              </div>
              <div className="col-md-4">
                <Sidebar />
              </div>
            </DrawingProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
