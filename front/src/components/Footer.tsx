import React from "react";

export const Footer: React.VFC = () => {
  const builtAt = import.meta.env.VITE_BUILT_AT
    ? new Date(Number(import.meta.env.VITE_BUILT_AT) * 1000)
    : null;

  const revision = import.meta.env.VITE_REVISION;

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
