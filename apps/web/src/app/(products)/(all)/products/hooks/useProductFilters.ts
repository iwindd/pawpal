import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CategoryKey } from "../components/Categories";

interface ProductsPageState {
  search: string;
  showFilters: boolean;
  category: CategoryKey;
  productType: string | null;
  platforms: string[];
  tags: string[];
  categories: string[];
}

export function useProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialState: ProductsPageState = {
    search: searchParams.get("search") || "",
    category: (searchParams.get("category") as CategoryKey) || "all",
    showFilters: false,
    productType: searchParams.get("type") || null,
    platforms: searchParams.get("platforms")?.split(",").filter(Boolean) || [],
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    categories:
      searchParams.get("categories")?.split(",").filter(Boolean) || [],
  };

  const updateURL = useCallback(
    (params: {
      search?: string;
      category?: CategoryKey;
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

  return {
    initialState,
    updateURL,
  };
}
