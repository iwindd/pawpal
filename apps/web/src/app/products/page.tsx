"use client";

import API from "@/libs/api/client";
import { IconSearch } from "@pawpal/icons";
import {
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  LoadingTrigger,
  Stack,
  Text,
  TextInput,
} from "@pawpal/ui/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import ProductCard from "../Home/components/ProductSections/components/card";
import Categories, { CategoryKey } from "./components/Categories";

interface ProductsPageState {
  search: string;
  showFilters: boolean;
  category: CategoryKey;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const __ = useTranslations("Products");

  const [state, setState] = useState<ProductsPageState>({
    search: searchParams.get("search") || "",
    category: (searchParams.get("category") as CategoryKey) || "all",
    showFilters: false,
  });

  // Fetch products with infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", state.search],
    queryFn: async ({ pageParam = 1 }) => {
      return await API.product.getAllProducts({
        page: pageParam,
        limit: 12,
        search: state.search || undefined,
        // TODO:: add category filter when backend supports it
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.data.total;
      const loaded = allPages.flatMap((p) => p.data.data).length;

      return loaded < total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all products from all pages
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.data) ?? [];
  }, [data]);

  const handleSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, search }));
    updateURL({ search, category: state.category });
  }, []);

  const handleCategory = useCallback((category: CategoryKey) => {
    setState((prev) => ({ ...prev, category }));
    updateURL({ search: state.search, category });
  }, []);

  const updateURL = useCallback(
    (params: { search?: string; category?: CategoryKey }) => {
      const newSearchParams = new URLSearchParams();

      if (params.search) newSearchParams.set("search", params.search);
      if (params.category) newSearchParams.set("category", params.category);

      const newURL = newSearchParams.toString()
        ? `/products?${newSearchParams.toString()}`
        : "/products";

      router.push(newURL);
    },
    [router]
  );

  // Handle end reached for infinite scroll
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Container mih={"100vh"}>
      <Stack>
        <Group mt="lg">
          <TextInput
            value={state.search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={__("searchPlaceholder")}
            rightSection={<IconSearch size={16} />}
          />
          <Divider orientation="vertical" />
          <Categories onFilter={handleCategory} value={state.category} />
        </Group>
        <Divider />

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
                      xs: 12,
                      sm: 6,
                      md: 4,
                      lg: 3,
                      xl: 2,
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
