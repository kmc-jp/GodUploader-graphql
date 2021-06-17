import React from "react";
import { useMeasure } from "react-use";
import { DrawingProvider } from "./TegakiDU/DrawingContext";
import { ColorSuggestion } from "./TegakiDU/ColorSuggestion";
import { Sidebar } from "./TegakiDU/Sidebar";
import { Canvas } from "./TegakiDU/Canvas";

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
          <ColorSuggestion />
        </div>
      </div>
    </div>
  );
};
