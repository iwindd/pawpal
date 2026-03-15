import { useCallback, useState } from "react";
import { CategoryKey } from "../components/Categories";
import { useProductFilters } from "./useProductFilters";

interface ProductsPageState {
  search: string;
  showFilters: boolean;
  category: CategoryKey;
  productType: string | null;
  platforms: string[];
  tags: string[];
  categories: string[];
}

export function useProductState() {
  const { initialState, updateURL } = useProductFilters();

  const [state, setState] = useState<ProductsPageState>(initialState);

  const handleSearch = useCallback(
    (search: string) => {
      setState((prev) => ({ ...prev, search }));
      updateURL({ search });
    },
    [updateURL],
  );

  const handleCategory = useCallback(
    (category: CategoryKey) => {
      setState((prev) => ({ ...prev, category }));
      updateURL({ category });
    },
    [updateURL],
  );

  const handleProductType = useCallback(
    (productType: string | null) => {
      setState((prev) => ({ ...prev, productType }));
      updateURL({ type: productType });
    },
    [updateURL],
  );

  const handlePlatforms = useCallback(
    (platforms: string[]) => {
      setState((prev) => ({ ...prev, platforms }));
      updateURL({ platforms });
    },
    [updateURL],
  );

  const handleTags = useCallback(
    (tags: string[]) => {
      setState((prev) => ({ ...prev, tags }));
      updateURL({ tags });
    },
    [updateURL],
  );

  const handleCategories = useCallback(
    (categories: string[]) => {
      setState((prev) => ({ ...prev, categories }));
      updateURL({ categories });
    },
    [updateURL],
  );

  return {
    state,
    setState,
    handlers: {
      handleSearch,
      handleCategory,
      handleProductType,
      handlePlatforms,
      handleTags,
      handleCategories,
    },
  };
}
