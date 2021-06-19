import { KonvaEventObject } from "konva/lib/Node";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Circle, Layer, Line, Stage } from "react-konva";
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

  const [mouseX, setMouseX] = useState(-999999);
  const [mouseY, setMouseY] = useState(-999999);

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
    setMouseX(e.evt.offsetX);
    setMouseY(e.evt.offsetY);

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

  const handleMouseLeave = (e: KonvaEventObject<MouseEvent>) => {
    // hide cursor
    setMouseX(-999999);
    setMouseY(-999999);
  };

  return (
    <div style={{ width: "inherit" }}>
      <Stage
        width={width}
        height={height}
        className="border border-dark"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <Layer>
          <Circle
            radius={strokeWidth}
            x={mouseX}
            y={mouseY}
            fill={color}
          ></Circle>
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
    </div>
  );
};
