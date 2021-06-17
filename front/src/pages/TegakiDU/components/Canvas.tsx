import { KonvaEventObject } from "konva/lib/Node";
import React, { useContext, useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import { DrawingContext } from "../contexts/DrawingContext";

type Point = number[];

type Drawing = {
  tool: "pen";
  strokeWidth: number;
  color: string;
  points: Point;
};

export const Canvas: React.VFC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const { color, strokeWidth } = useContext(DrawingContext);
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
    setLines([
      ...lines,
      { tool: "pen", color, strokeWidth, points: [pos.x, pos.y] },
    ]);
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
            strokeWidth={line.strokeWidth}
            lineCap="round"
          />
        ))}
      </Layer>
    </Stage>
  );
};
