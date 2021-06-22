import React from "react";
import { useMeasure } from "react-use";

import { Canvas } from "./components/Canvas";
import { ColorSuggestion } from "./components/ColorSuggestion";
import { Sidebar } from "./components/Sidebar";
import { DrawingProvider } from "./contexts/DrawingContext";
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
          <div className="row mb-3 d-flex justify-content-center">
            <PaintStackContextProvider>
              <DrawingProvider>
                <div className="col-md-7" style={{ height: 482 }} ref={ref}>
                  <Canvas width={width - 2} height={height - 2} />
                </div>
                <div className="col-md-5">
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
