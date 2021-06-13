import React from "react";

export const LoadingOverlay: React.FC = () => {
  return (
    <div
      style={{
        zIndex: 10000,
        background: "rgba(99, 99, 99, 0.3)",
        position: "fixed",
        width: "100%",
        height: "100%",
      }}
    >
      <div className="position-absolute top-50 start-50 translate-middle">
        <div
          className="spinner-border"
          role="status"
          style={{ width: "5rem", height: "5rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};
