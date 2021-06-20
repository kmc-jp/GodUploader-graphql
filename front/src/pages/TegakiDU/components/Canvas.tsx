import { KonvaEventObject } from "konva/lib/Node";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Circle, Layer, Line, Rect, Stage } from "react-konva";
import { DrawingContext } from "../contexts/DrawingContext";
import { PaintStackContext } from "../contexts/PaintStackContext";

export const Canvas: React.VFC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const { color, strokeWidth, stageRef } = useContext(DrawingContext);
  const isDrawing = useRef(false);
  const { paints, setPaints, append, undo, redo } =
    useContext(PaintStackContext);

  const [mouseX, setMouseX] = useState(-999999);
  const [mouseY, setMouseY] = useState(-999999);

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
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
    },
    [color, paints, setPaints, strokeWidth]
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
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
      if (!(lastLine && lastLine.tool === "pen")) {
        return;
      }

      lastLine.points = lastLine.points.concat([point.x, point.y]);
      paints.splice(paints.length - 1, 1, lastLine);
      setPaints(paints.concat());
    },
    [paints, setPaints]
  );

  const handleMouseUp = useCallback(() => {
    append(paints);
    isDrawing.current = false;
  }, [append, paints]);

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

  const handleMouseLeave = useCallback(() => {
    // hide cursor
    setMouseX(-999999);
    setMouseY(-999999);
  }, []);

  return (
    <div style={{ width: "inherit" }}>
      <Stage
        width={width}
        height={height}
        className="border border-dark"
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <Layer>
          {paints.map((paint, i) => {
            if (paint.tool === "pen") {
              return (
                <Line
                  key={i}
                  points={paint.points}
                  stroke={paint.color}
                  strokeWidth={paint.strokeWidth}
                  lineCap="round"
                />
              );
            } else if (paint.tool === "fill") {
              return (
                <Rect
                  key={i}
                  fill={paint.color}
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                />
              );
            }
            return null;
          })}
          <Circle
            radius={strokeWidth}
            x={mouseX}
            y={mouseY}
            fill={color}
          ></Circle>
        </Layer>
      </Stage>
    </div>
  );
};
