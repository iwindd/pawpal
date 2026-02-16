"use client";
import { AddButtonLink } from "@/components/Button/AddButton";
import ProductDatatable from "@/components/Datatables/Product";
import PageHeader from "@/components/Pages/PageHeader";
import { getPath } from "@/configs/route";
import { useGetProductsQuery } from "@/features/productApi/productApi";
import useDatatable from "@/hooks/useDatatable";
import { AdminProductResponse } from "@pawpal/shared";
import { Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const datatable = useDatatable<AdminProductResponse>();
  const __ = useTranslations("Product");

  const { data, isLoading } = useGetProductsQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sort,
  });

  return (
    <div>
      <PageHeader title={__("main.title")}>
        <AddButtonLink href={getPath("products.create")}>
          {__("main.add-btn")}
        </AddButtonLink>
      </PageHeader>

      <Paper p={0}>
        <ProductDatatable
          records={data?.data ?? []}
          fetching={isLoading}
          totalRecords={data?.total ?? 0}
          {...datatable}
        />
      </Paper>
    </div>
  );
}
