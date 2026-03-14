import { useCallback } from "react";

export function useInfiniteScroll(hasNextPage: boolean, isFetchingNextPage: boolean, fetchNextPage: () => void) {
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    handleEndReached,
  };
}
