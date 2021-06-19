import { KonvaEventObject } from "konva/lib/Node";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Layer, Line, Stage } from "react-konva";
import { DrawingContext } from "../contexts/DrawingContext";
import { PaintStackContext } from "../contexts/PaintStackContext";

export const Canvas: React.VFC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const { color, strokeWidth } = useContext(DrawingContext);
  const isDrawing = useRef(false);
  const { paints, setPaints, append, undo, redo } =
    useContext(PaintStackContext);

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
    setPaints([
      ...paints,
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

    const lastLine = paints[paints.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    paints.splice(paints.length - 1, 1, lastLine);
    setPaints(paints.concat());
  };

  const handleMouseUp = () => {
    append(paints);
    isDrawing.current = false;
  };

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (!e.ctrlKey) {
        return;
      }

      if (e.key === "z") {
        undo();
      } else if (e.key === "y") {
        redo();
      }
    },
    [redo, undo]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

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
        {paints.map((line, i) => (
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
