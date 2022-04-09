import dynamic from "next/dynamic";
import { useMeasure } from "react-use";

import { DrawingProvider } from "../../lib/contexts/TegakiDU/DrawingContext";
import { PaintStackContextProvider } from "../../lib/contexts/TegakiDU/PaintStackContext";
import { Canvas } from "./Canvas";
import { ColorSuggestion } from "./ColorSuggestion";
import { Sidebar } from "./Sidebar";

const TegakiDUCore: React.VFC = () => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  return (
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
  );
};

export default TegakiDUCore;
