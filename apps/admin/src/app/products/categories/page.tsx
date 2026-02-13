"use client";
import CategoryDatatable from "@/components/Datatables/Category";
import PageHeader from "@/components/Pages/PageHeader";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import useDatatable from "@/hooks/useDatatable";
import { IconPlus } from "@pawpal/icons";
import { AdminCategoryResponse } from "@pawpal/shared";
import { Button, Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link"; // Assuming we link to create page

export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  const datatable = useDatatable<AdminCategoryResponse>();
  const __ = useTranslations("Product.category"); // Reuse or create new translation key

  const { data, isLoading } = useGetCategoriesQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sort,
  });

  return (
    <main>
      <PageHeader title={__("title")}>
        <Button
          component={Link}
          href="/products/categories/create" // Assuming create page exists or will be created
          variant="outline"
          rightSection={<IconPlus size={14} />}
        >
          {__("add-btn")}
        </Button>
      </PageHeader>

      <Paper p={0}>
        <CategoryDatatable
          records={data?.data ?? []}
          fetching={isLoading}
          totalRecords={data?.total ?? 0}
          {...datatable}
        />
      </Paper>
    </main>
  );
}
