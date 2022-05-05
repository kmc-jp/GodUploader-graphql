import clsx from "clsx";
import { useMemo } from "react";

interface FilesizeBarProps {
  filesize: number;
  maxFilesize: number;
}

export const FilesizeBar: React.VFC<FilesizeBarProps> = ({
  filesize,
  maxFilesize,
}) => {
  const ratio = useMemo(
    () => Math.trunc((filesize / maxFilesize) * 100),
    [filesize, maxFilesize]
  );

  return (
    <div className="progress">
      <div
        className={clsx("progress-bar", ratio >= 100 && "bg-danger")}
        role="progressbar"
        style={{ width: `${ratio}%` }}
        aria-valuenow={ratio}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {ratio}%
      </div>
    </div>
  );
};
