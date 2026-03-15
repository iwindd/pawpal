"use client";

import { useDebouncedValue } from "@pawpal/ui/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGetInfiniteProductsInfiniteQuery } from "../../../../../features/product/productApi";

interface ProductsPageState {
  search: string;
  showFilters: boolean;
  category: string;
  productType: string | null;
  platforms: string[];
  tags: string[];
  categories: string[];
}

interface ProductContextType {
  state: ProductsPageState;
  productsQuery: {
    data?: { pages: { data: any[]; total: number }[] };
    isLoading: boolean;
    error?: any;
    totalCount: number;
    fetchNextPage: () => void;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
  };
  handlers: {
    handleSearch: (search: string) => void;
    handleCategory: (category: string) => void;
    handleProductType: (productType: string | null) => void;
    handlePlatforms: (platforms: string[]) => void;
    handleTags: (tags: string[]) => void;
    handleCategories: (categories: string[]) => void;
    toggleFilters: () => void;
  };
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
}

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialState: ProductsPageState = {
    search: searchParams.get("search") || "",
    category: (searchParams.get("category") as string) || "all",
    showFilters: false,
    productType: searchParams.get("type") || null,
    platforms: searchParams.get("platforms")?.split(",").filter(Boolean) || [],
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    categories:
      searchParams.get("categories")?.split(",").filter(Boolean) || [],
  };

  const [state, setState] = useState<ProductsPageState>(initialState);

  // Debounced values for URL updates (2 second delay)
  const [debouncedSearch] = useDebouncedValue(state.search, 2000);
  const [debouncedCategory] = useDebouncedValue(state.category, 2000);
  const [debouncedProductType] = useDebouncedValue(state.productType, 2000);
  const [debouncedPlatforms] = useDebouncedValue(state.platforms, 2000);
  const [debouncedTags] = useDebouncedValue(state.tags, 2000);
  const [debouncedCategories] = useDebouncedValue(state.categories, 2000);

  // Fetch products with infinite query
  const productsQuery = useGetInfiniteProductsInfiniteQuery({
    limit: 5 * 4,
    search: state.search,
    categories: state.category === "all" ? undefined : [state.category],
    types: state.productType ? [state.productType] : undefined,
    platforms: state.platforms.length > 0 ? state.platforms : undefined,
    tags: state.tags.length > 0 ? state.tags : undefined,
  });

  // Get total count from first page or fallback to 0
  const totalCount = productsQuery.data?.pages[0]?.total ?? 0;

  const updateURL = useCallback(
    (params: {
      search?: string;
      category?: string;
      type?: string | null;
      platforms?: string[];
      tags?: string[];
      categories?: string[];
    }) => {
      const newSearchParams = new URLSearchParams();

      if (params.search) newSearchParams.set("search", params.search);
      if (params.category) newSearchParams.set("category", params.category);
      if (params.type) newSearchParams.set("type", params.type);
      if (params.platforms && params.platforms.length > 0) {
        newSearchParams.set("platforms", params.platforms.join(","));
      }
      if (params.tags && params.tags.length > 0) {
        newSearchParams.set("tags", params.tags.join(","));
      }
      if (params.categories && params.categories.length > 0) {
        newSearchParams.set("categories", params.categories.join(","));
      }

      const newURL = newSearchParams.toString()
        ? `/products?${newSearchParams.toString()}`
        : "/products";

      router.push(newURL);
    },
    [router],
  );

  // Update URL when debounced values change
  useEffect(() => {
    updateURL({
      search: debouncedSearch,
      category: debouncedCategory,
      type: debouncedProductType,
      platforms: debouncedPlatforms,
      tags: debouncedTags,
      categories: debouncedCategories,
    });
  }, [
    debouncedSearch,
    debouncedCategory,
    debouncedProductType,
    debouncedPlatforms,
    debouncedTags,
    debouncedCategories,
    updateURL,
  ]);

  const handleSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, search }));
  }, []);

  const handleCategory = useCallback((category: string) => {
    setState((prev) => ({ ...prev, category }));
  }, []);

  const handleProductType = useCallback((productType: string | null) => {
    setState((prev) => ({ ...prev, productType }));
  }, []);

  const handlePlatforms = useCallback((platforms: string[]) => {
    setState((prev) => ({ ...prev, platforms }));
  }, []);

  const handleTags = useCallback((tags: string[]) => {
    setState((prev) => ({ ...prev, tags }));
  }, []);

  const handleCategories = useCallback((categories: string[]) => {
    setState((prev) => ({ ...prev, categories }));
  }, []);

  const toggleFilters = useCallback(() => {
    setState((prev) => ({ ...prev, showFilters: !prev.showFilters }));
  }, []);

  const value: ProductContextType = {
    state,
    productsQuery: {
      data: productsQuery.data,
      isLoading: productsQuery.isLoading,
      error: productsQuery.error,
      totalCount,
      fetchNextPage: productsQuery.fetchNextPage,
      hasNextPage: productsQuery.hasNextPage,
      isFetchingNextPage: productsQuery.isFetchingNextPage,
    },
    handlers: {
      handleSearch,
      handleCategory,
      handleProductType,
      handlePlatforms,
      handleTags,
      handleCategories,
      toggleFilters,
    },
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
