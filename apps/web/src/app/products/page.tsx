"use client";

import ProductCard from "@/components/Card/ProductCart";
import { useGetInfiniteProductsInfiniteQuery } from "@/features/product/productApi";
import { useAppSelector } from "@/hooks";
import { IconFilters } from "@pawpal/icons";
import {
  ActionIcon,
  Center,
  Container,
  Grid,
  Group,
  Loader,
  LoadingTrigger,
  Stack,
  Text,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import AdvancedFilters from "./components/AdvancedFilters";
import SearchBar from "./components/SearchBar";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useProductState } from "./hooks/useProductState";

export default function ProductsPage() {
  const __ = useTranslations("Products");

  // Get product filters from Redux store (preloaded from server-side)
  const filtersData = useAppSelector((state) => state.product.filters);

  // Use organized hooks for state management
  const { state, handlers } = useProductState();

  // Fetch products with infinite query
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useGetInfiniteProductsInfiniteQuery({
    limit: 6 * 4,
    search: state.search,
    categories: state.category === "all" ? undefined : [state.category],
    types: state.productType ? [state.productType] : undefined,
    platforms: state.platforms.length > 0 ? state.platforms : undefined,
    tags: state.tags.length > 0 ? state.tags : undefined,
  });

  // Use organized hook for infinite scroll
  const { handleEndReached } = useInfiniteScroll(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  );

  // Flatten all products from all pages
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return (
    <Container mih={"100vh"}>
      <Stack>
        <Group>
          <SearchBar
            search={state.search}
            onSearchChange={handlers.handleSearch}
          />
          <ActionIcon variant="light" color="secondary" size="lg">
            <IconFilters style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Group>

        <AdvancedFilters
          filtersData={filtersData || undefined}
          productType={state.productType}
          platforms={state.platforms}
          tags={state.tags}
          categories={state.categories}
          onProductTypeChange={handlers.handleProductType}
          onPlatformsChange={handlers.handlePlatforms}
          onTagsChange={handlers.handleTags}
          onCategoriesChange={handlers.handleCategories}
        />

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
            hasNextPage={hasNextPage}
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
