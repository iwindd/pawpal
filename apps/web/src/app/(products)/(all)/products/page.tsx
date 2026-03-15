"use client";

import ProductCard from "@/components/Card/ProductCart";
import ProductCardSkeleton from "@/components/Card/ProductCart/skeleton";
import {
  Center,
  Container,
  Loader,
  LoadingTrigger,
  SimpleGrid,
  Stack,
  Text,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useProductContext } from "./context/ProductContext";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";

export default function ProductsPage() {
  const __ = useTranslations("Products");

  // Use context for state management and query
  const { productsQuery } = useProductContext();

  // Extract data from context query
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = productsQuery;

  // Use organized hook for infinite scroll
  const { handleEndReached } = useInfiniteScroll(
    hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  );

  // Flatten all products from all pages
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.data) ?? [];
  }, [data]);

  return (
    <Container mih={"100vh"}>
      <Stack>
        {/* Products Grid */}
        <Stack pb="lg">
          {(() => {
            if (error) {
              return (
                <Center h="50vh">
                  <Text>{__("error")}</Text>
                </Center>
              );
            }

            return (
              <SimpleGrid
                cols={{
                  base: 1, // มือถือ 1 การ์ด/แถว
                  xs: 3, // แท็บเล็ต 3 การ์ด/แถว
                  lg: 5, // หน้าจอ >md (เช่น lg ขึ้นไป) 5 การ์ด/แถว
                }}
              >
                {isLoading
                  ? Array.from({ length: 20 }).map((_, index) => (
                      <ProductCardSkeleton key={index} />
                    ))
                  : allProducts.map((product) => (
                      <ProductCard key={product.slug} product={product} />
                    ))}
              </SimpleGrid>
            );
          })()}

          {/* Loading trigger for infinite scroll */}
          <LoadingTrigger
            onLoadMore={handleEndReached}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            manualFallbackText={__("loadMore")}
            h="20"
            w="100%"
          >
            <Center>
              <Loader size="sm" />
            </Center>
          </LoadingTrigger>
        </Stack>
      </Stack>
    </Container>
  );
}
