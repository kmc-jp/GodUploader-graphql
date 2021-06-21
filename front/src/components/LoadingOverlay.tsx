import React from "react";

import styles from "./LoadingOverlay.module.css";

export const LoadingOverlay: React.FC = () => {
  return (
    <div className={styles.Overlay}>
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
