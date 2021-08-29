import React, { Suspense, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router";

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
  const currentLocation = useLocation();
  const history = useHistory();
  const previousElement = useRef<React.ReactElement>();

  useEffect(() => {
    const dispose = history.listen((nextLocation, action) => {
      if (nextLocation !== currentLocation) {
        if (action !== "REPLACE") {
          previousElement.current = children;
        }
        onLoadStart();
      }
    });

    return () => {
      onLoadEnd();
      dispose();
    };
  }, [history, currentLocation, onLoadStart, onLoadEnd, children]);

  return (
    <Suspense
      fallback={
        <Suspense fallback={null}>
          {previousElement.current}
          <LoadingWatcher onLoadStart={onLoadStart} onLoadEnd={onLoadEnd} />
        </Suspense>
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
