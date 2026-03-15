"use client";

import ProductCard from "@/components/Card/ProductCart";
import ProductCardSkeleton from "@/components/Card/ProductCart/skeleton";
import { ProductResponse } from "@pawpal/shared";
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
import { useInfiniteScroll } from "../../../(all)/products/hooks/useInfiniteScroll";
import { useProductContext } from "./product-context";

export default function TypeProductsPageContent() {
  const __ = useTranslations("Products");
  const { productsQuery } = useProductContext();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = productsQuery;

  const { handleEndReached } = useInfiniteScroll(
    hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  );

  const allProducts = useMemo(() => {
    return (data?.pages.flatMap((page: any) => page.data) ?? []) as ProductResponse[];
  }, [data]);

  return (
    <Container mih={"100vh"}>
      <Stack>
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
                  base: 1,
                  xs: 3,
                  lg: 5,
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
