import React from "react";
import { useMeasure } from "react-use";
import { DrawingProvider } from "./contexts/DrawingContext";
import { ColorSuggestion } from "./components/ColorSuggestion";
import { Sidebar } from "./components/Sidebar";
import { Canvas } from "./components/Canvas";
import { PaintStackContextProvider } from "./contexts/PaintStackContext";

export const TegakiDU: React.VFC = () => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">TEGAKI Draw and Upload</h2>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <PaintStackContextProvider>
              <DrawingProvider>
                <div className="col-md-8" style={{ height: 482 }} ref={ref}>
                  <Canvas width={width} height={height} />
                </div>
                <div className="col-md-4">
                  <Sidebar />
                </div>
              </DrawingProvider>
            </PaintStackContextProvider>
          </div>
          <ColorSuggestion />
        </div>
      </div>
    </div>
  );
};
