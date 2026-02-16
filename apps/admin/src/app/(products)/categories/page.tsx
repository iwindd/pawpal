"use client";
import { AddButton } from "@/components/Button/AddButton";
import CategoryDatatable from "@/components/Datatables/Category";
import CreateCategoryModal from "@/components/Modals/CreateCategoryModal";
import PageHeader from "@/components/Pages/PageHeader";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import useDatatable from "@/hooks/useDatatable";
import { AdminCategoryResponse } from "@pawpal/shared";
import { Paper } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  const datatable = useDatatable<AdminCategoryResponse>();
  const __ = useTranslations("Product.category");

  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const { data, isLoading } = useGetCategoriesQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sort,
  });

  return (
    <main>
      <PageHeader title={__("title")}>
        <AddButton onClick={openCreateModal}>{__("add-btn")}</AddButton>
      </PageHeader>

      <Paper p={0}>
        <CategoryDatatable
          records={data?.data ?? []}
          fetching={isLoading}
          totalRecords={data?.total ?? 0}
          {...datatable}
        />
      </Paper>

      <CreateCategoryModal
        opened={createModalOpened}
        onClose={closeCreateModal}
      />
    </main>
  );
}
