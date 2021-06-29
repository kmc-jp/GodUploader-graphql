import React from "react";

export const Footer: React.VFC = () => {
  const builtAt = process.env.REACT_APP_BUILT_AT
    ? new Date(Number(process.env.REACT_APP_BUILT_AT) * 1000)
    : null;

  return (
    <div className="footer mt-3 py-3 bg-light">
      <div className="container">
        <div className="text-muted">
          Goduploader-graphql
          {builtAt && ` (built at ${builtAt.toLocaleString()})`}
        </div>
      </div>
    </div>
  );
};
