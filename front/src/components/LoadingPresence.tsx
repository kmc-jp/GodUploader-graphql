import React, { Suspense, useEffect } from "react";
import { useLocation } from "react-router";

interface LoadingPresenceProps {
  children: React.ReactElement;
  onLoadStart: () => void;
  onLoadEnd: () => void;
}

export const LoadingPresence: React.VFC<LoadingPresenceProps> = ({
  children,
  onLoadStart,
  onLoadEnd,
}) => {
  const location = useLocation();

  useEffect(() => {
    onLoadStart();
  }, [location.key, onLoadStart]);

  return (
    <Suspense
      fallback={
        <LoadingWatcher onLoadStart={onLoadStart} onLoadEnd={onLoadEnd} />
      }
    >
      {children}
      <ImmediateEndLoad onLoadEnd={onLoadEnd} />
    </Suspense>
  );
};

interface LoadingWatcherProps {
  onLoadStart: () => void;
  onLoadEnd: () => void;
}

const LoadingWatcher: React.VFC<LoadingWatcherProps> = ({
  onLoadStart,
  onLoadEnd,
}) => {
  useEffect(() => {
    onLoadStart();
    return () => onLoadEnd();
  });
  return null;
};

// suspendしないコンポーネント用
const ImmediateEndLoad: React.VFC<Pick<LoadingWatcherProps, "onLoadEnd">> = ({
  onLoadEnd,
}) => {
  useEffect(() => onLoadEnd());
  return null;
};
