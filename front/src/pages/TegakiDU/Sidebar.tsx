import React, { useContext } from "react";
import { DrawingContext } from "./DrawingContext";

export const Sidebar: React.VFC = () => {
  const {
    color,
    backgroundColor,
    strokeWidth,
    setColor,
    setBackgroundColor,
    setStrokeWidth,
  } = useContext(DrawingContext);

  return (
    <div className="container h-100">
      <div className="row">
        <div className="col-sm-10">
          <input
            type="range"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            min={1}
            max={20}
            className="w-100"
          />
        </div>
        <div className="col-sm-2">{strokeWidth}</div>
      </div>
      <div className="row" style={{ height: "15%" }}>
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
