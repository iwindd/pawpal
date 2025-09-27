"use client";

import { Center, Loader } from "@pawpal/ui/core";
import { useEffect, useRef } from "react";

// Loading trigger component for intersection observer
export const LoadingTrigger = ({
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: Readonly<{
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}>) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <div ref={ref} style={{ height: "20px", width: "100%" }}>
      {isFetchingNextPage && (
        <Center>
          <Loader size="sm" />
        </Center>
      )}
    </div>
  );
};

export default LoadingTrigger;
