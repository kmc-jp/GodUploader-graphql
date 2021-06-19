import React from "react";
import { DrawingProvider } from "./contexts/DrawingContext";
import { ColorSuggestion } from "./components/ColorSuggestion";
import { Sidebar } from "./components/Sidebar";
import { Canvas } from "./components/Canvas";
import { PaintStackContextProvider } from "./contexts/PaintStackContext";

export const TegakiDU: React.VFC = () => {
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
                <div className="col-md-8" style={{ width: 642, height: 482 }}>
                  <Canvas width={640} height={480} />
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
