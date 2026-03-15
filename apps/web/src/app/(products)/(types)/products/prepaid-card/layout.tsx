"use client";

import { useAppSelector } from "@/hooks";
import { ProductFiltersResponse, ProductType } from "@pawpal/shared";
import { ReactNode } from "react";
import TypeProductsLayout from "../_shared/layout";

export default function PrepaidCardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const globalFiltersData = useAppSelector((state) => state.product.filters);
  const filtersDataOverride: ProductFiltersResponse | undefined =
    globalFiltersData
      ? {
          ...globalFiltersData,
          categories: globalFiltersData.categories.filter(
            (category) => category.type === ProductType.CARD,
          ),
        }
      : undefined;

  return (
    <TypeProductsLayout
      basePath="/products/prepaid-card"
      filtersDataOverride={filtersDataOverride}
      productType="CARD"
      visibleFilterSections={{
        categories: true,
        platforms: false,
        tags: true,
      }}
    >
      {children}
    </TypeProductsLayout>
  );
}
