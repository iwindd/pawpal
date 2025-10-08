"use client";

import { Anchor, Box, BoxProps, Center } from "@mantine/core";
import { useEffect, useRef } from "react";

export interface LoadingTriggerProps extends BoxProps {
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  manualFallbackText?: string;
  noManualFallback?: boolean;
  children?: React.ReactNode;
}

// Loading trigger component for intersection observer
export const LoadingTrigger = ({
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
  manualFallbackText,
  noManualFallback,
  children,
  ...props
}: LoadingTriggerProps) => {
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
    <Box {...props} ref={ref}>
      {isFetchingNextPage && children}
      {hasNextPage && !isFetchingNextPage && !noManualFallback && (
        <Center>
          <Anchor onClick={onLoadMore}>
            {manualFallbackText || "Load more"}
          </Anchor>
        </Center>
      )}
    </Box>
  );
};

export default LoadingTrigger;
