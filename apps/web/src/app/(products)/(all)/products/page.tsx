"use client";

import ProductCard from "@/components/Card/ProductCart";
import {
  Center,
  Container,
  Grid,
  Loader,
  LoadingTrigger,
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
            if (isLoading) {
              return (
                <Center h="50vh">
                  <Loader size="lg" />
                </Center>
              );
            }

            if (error) {
              return (
                <Center h="50vh">
                  <Text>{__("error")}</Text>
                </Center>
              );
            }

            return (
              <Grid>
                {allProducts.map((product) => (
                  <Grid.Col
                    key={product.slug}
                    span={{
                      base: 12,
                      xs: 3,
                      md: 2,
                    }}
                  >
                    <ProductCard product={product} />
                  </Grid.Col>
                ))}
              </Grid>
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
