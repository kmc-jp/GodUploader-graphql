import { KonvaEventObject } from "konva/lib/Node";
import React, { useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import { useMeasure } from "react-use";

type Point = number[];

type Drawing = {
  tool: "pen";
  points: Point;
};

const Canvas: React.VFC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
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
    setLines([...lines, { tool: "pen", points: [pos.x, pos.y] }]);
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
          <Line key={i} points={line.points} stroke="black" lineCap="round" />
        ))}
      </Layer>
    </Stage>
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
            <div className="col-md-8" style={{ height: 482 }} ref={ref}>
              <Canvas width={width} height={height} />
            </div>
            <div className="col-md-4">iroiro</div>
          </div>
        </div>
      </div>
    </div>
  );
};
