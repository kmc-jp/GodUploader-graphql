import dynamic from "next/dynamic";
import React from "react";

const DynamicTegakiDUCore = dynamic(
  () => import("../components/TegakiDU/Core"),
  { ssr: false }
);

const TegakiDU: React.VFC = () => {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">TEGAKI Draw and Upload</h2>
        </div>
        <div className="card-body">
          <DynamicTegakiDUCore />
        </div>
      </div>
    </div>
  );
};

export default TegakiDU;
