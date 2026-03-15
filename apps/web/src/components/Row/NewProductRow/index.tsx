"use client";
import ItemSlider from "@/app/home/components/builder/ItemSlider";
import { useGetInfiniteProductsInfiniteQuery } from "@/features/product/productApi";
import { ProductResponse } from "@pawpal/shared";
import { DataTableSortStatus } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const NewProductRow = () => {
  const __ = useTranslations("Home.ProductSections.NewProductRow");

  const { data } = useGetInfiniteProductsInfiniteQuery({
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

export default NewProductRow;
