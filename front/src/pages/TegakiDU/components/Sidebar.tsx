import React, { useContext } from "react";
import { DrawingContext } from "../contexts/DrawingContext";
import { PaintStackContext } from "../contexts/PaintStackContext";

export const Sidebar: React.VFC = () => {
  const {
    color,
    backgroundColor,
    strokeWidth,
    setColor,
    setBackgroundColor,
    setStrokeWidth,
  } = useContext(DrawingContext);
  const { setPaints, append, undo, redo, undoable, redoable } =
    useContext(PaintStackContext);

  const handleDeleteAll = () => {
    if (
      !window.confirm(
        "本当に全て消してしまいますか？ (現在の背景色で塗りつぶします。)"
      )
    ) {
      return;
    }

    setPaints([{ tool: "fill", color: backgroundColor }]);
    append([{ tool: "fill", color: backgroundColor }]);
  };

  return (
    <div className="container h-100">
      <div className="row">
        <div className="col-sm-10">
          <div className="row mb-2">
            <div className="col-sm-2">
              <label htmlFor="stroke_width">太さ</label>
            </div>
            <div className="col">
              <input
                type="range"
                id="stroke_width"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                min={1}
                max={20}
                className="w-100"
              />
            </div>
            <div className="col-sm-2">{strokeWidth}</div>
          </div>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col">
          ペンの色
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-100"
          />
        </div>
        <div className="col">
          背景色
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-100"
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <button
            className="btn btn-secondary w-100"
            disabled={!undoable}
            onClick={undo}
          >
            元に戻す
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-secondary w-100"
            disabled={!redoable}
            onClick={redo}
          >
            やり直す
          </button>
        </div>
        <div className="mt-2">
          <button className="btn btn-danger w-100" onClick={handleDeleteAll}>
            全て消す
          </button>
        </div>
      </div>
    </div>
  );
};
