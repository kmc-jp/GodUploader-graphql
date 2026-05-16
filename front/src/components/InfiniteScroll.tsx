import React, { useEffect, useRef } from "react";

type Props = {
  loadMore: () => void;
  hasMore: boolean;
  loader: React.ReactNode;
  children: React.ReactNode;
};

export const InfiniteScroll: React.FC<Props> = ({
  loadMore,
  hasMore,
  loader,
  children,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(loadMore);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRef.current();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <>
      {children}
      {hasMore && loader}
      <div ref={sentinelRef} />
    </>
  );
};
