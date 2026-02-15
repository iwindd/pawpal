"use client";
import CategoryDatatable from "@/components/Datatables/Category";
import CreateCategoryModal from "@/components/Modals/CreateCategoryModal";
import PageHeader from "@/components/Pages/PageHeader";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import useDatatable from "@/hooks/useDatatable";
import { IconPlus } from "@pawpal/icons";
import { AdminCategoryResponse } from "@pawpal/shared";
import { Button, Paper } from "@pawpal/ui/core";
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
        <Button
          onClick={openCreateModal}
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

      <CreateCategoryModal
        opened={createModalOpened}
        onClose={closeCreateModal}
      />
    </main>
  );
}
