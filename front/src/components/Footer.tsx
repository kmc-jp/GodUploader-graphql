import React from "react";

export const Footer: React.VFC = () => {
  const builtAt = process.env.REACT_APP_BUILT_AT
    ? new Date(Number(process.env.REACT_APP_BUILT_AT) * 1000)
    : null;

  const revision = process.env.REACT_APP_REVISION;

  return (
    <footer className="mt-3 py-3">
      <div className="container">
        <div className="text-muted">
          Goduploader-graphql
          {builtAt && ` (built at ${builtAt.toLocaleString()})`}
          {revision && (
            <>
              {" "}
              revision{" "}
              <a
                href={`https://github.com/kmc-jp/GodUploader-graphql/commit/${revision}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {revision}
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};
