"use client";
import ItemSlider from "@/app/home/components/builder/ItemSlider";
import { useGetInfiniteSaleProductsInfiniteQuery } from "@/features/product/productApi";
import { ProductResponse } from "@pawpal/shared";
import { DataTableSortStatus } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const SaleProductRow = () => {
  const __ = useTranslations("Home.ProductSections.SaleProductRow");

  const { data } = useGetInfiniteSaleProductsInfiniteQuery({
    limit: 12,
    sort: JSON.stringify({
      columnAccessor: "createdAt",
      direction: "desc",
    } as DataTableSortStatus<ProductResponse>),
  });

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return <ItemSlider title={__("title")} items={products} />;
};

export default SaleProductRow;
