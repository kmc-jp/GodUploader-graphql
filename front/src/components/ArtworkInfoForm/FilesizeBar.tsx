import React, { useMemo } from "react";
import { ProgressBar } from "react-bootstrap";

interface FilesizeBarProps {
  filesize: number;
  maxFilesize: number;
}

export const FilesizeBar: React.FC<FilesizeBarProps> = ({
  filesize,
  maxFilesize,
}) => {
  const ratio = useMemo(
    () => Math.trunc((filesize / maxFilesize) * 100),
    [filesize, maxFilesize],
  );

  return (
    <ProgressBar
      now={ratio}
      label={`${ratio}%`}
      variant={ratio >= 100 ? "danger" : undefined}
    />
  );
};
