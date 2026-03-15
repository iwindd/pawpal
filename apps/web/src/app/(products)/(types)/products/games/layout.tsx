"use client";

import { useAppSelector } from "@/hooks";
import { ProductFiltersResponse, ProductType } from "@pawpal/shared";
import { ReactNode } from "react";
import TypeProductsLayout from "../_shared/layout";

export default function GamesLayout({ children }: { children: ReactNode }) {
  const globalFiltersData = useAppSelector((state) => state.product.filters);
  const filtersDataOverride: ProductFiltersResponse | undefined =
    globalFiltersData
      ? {
          ...globalFiltersData,
          categories: globalFiltersData.categories.filter(
            (category) => category.type === ProductType.GAME,
          ),
        }
      : undefined;

  return (
    <TypeProductsLayout
      basePath="/products/games"
      filtersDataOverride={filtersDataOverride}
      productType="GAME"
      visibleFilterSections={{
        categories: true,
        platforms: true,
        tags: true,
      }}
    >
      {children}
    </TypeProductsLayout>
  );
}
