import { KonvaEventObject } from "konva/lib/Node";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Circle, Layer, Line, Rect, Stage } from "react-konva";
import { Prompt } from "react-router-dom";

import { DrawingContext } from "../contexts/DrawingContext";
import { PaintStackContext } from "../contexts/PaintStackContext";

const isTouchDevice = () => navigator.maxTouchPoints > 0;

export const Canvas: React.VFC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const { color, strokeWidth, stageRef, isPosting } =
    useContext(DrawingContext);
  const isDrawing = useRef(false);
  const { paints, setPaints, append, undo, redo } =
    useContext(PaintStackContext);

  const [mouseX, setMouseX] = useState(-999999);
  const [mouseY, setMouseY] = useState(-999999);

  const handleTouchStart = useCallback(
    (e: KonvaEventObject<Event>) => {
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

  const addPoints = useCallback(
    (e: KonvaEventObject<Event>) => {
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

  const handleTouchMove = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      // avoid swipe scroll
      e.evt.preventDefault();

      addPoints(e);
    },
    [addPoints]
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      setMouseX(e.evt.offsetX);
      setMouseY(e.evt.offsetY);
      addPoints(e);
    },
    [addPoints]
  );

  const handleTouchEnd = useCallback(
    (e: KonvaEventObject<Event>) => {
      if (!isDrawing.current) {
        return;
      }

      const lastLine = paints[paints.length - 1];
      if (!(lastLine && lastLine.tool === "pen")) {
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

      lastLine.points = lastLine.points.concat([point.x, point.y]);
      paints.splice(paints.length - 1, 1, lastLine);
      setPaints(paints.concat());
      append(paints);
      isDrawing.current = false;
    },
    [append, paints, setPaints]
  );

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (isDrawing.current) {
        return;
      }

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
    <div className="mw-100">
      <Prompt
        when={paints.length > 0 && !isPosting}
        message="このページを離れると絵は破棄されます。"
      />
      <Stage
        width={width}
        height={height}
        className="border border-dark"
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleTouchEnd}
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
          {!isTouchDevice() && (
            <Circle
              radius={strokeWidth / 2}
              x={mouseX}
              y={mouseY}
              fill={color}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};
