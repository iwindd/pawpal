"use client";
import { AddButton } from "@/components/Button/AddButton";
import ProductTagDatatable from "@/components/Datatables/ProductTag";
import CreateProductTagModal from "@/components/Modals/CreateProductTagModal";
import PageHeader from "@/components/Pages/PageHeader";
import { useGetProductTagsQuery } from "@/features/productApi/productTagApi";
import useDatatable from "@/hooks/useDatatable";
import { AdminProductTagResponse } from "@pawpal/shared";
import { Paper } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

export default function ProductTagsPage() {
  const datatable = useDatatable<AdminProductTagResponse>();
  const [open, { open: openModal, close: closeModal }] = useDisclosure();
  const __ = useTranslations("ProductTag");

  const { data, isLoading, refetch } = useGetProductTagsQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sort,
  });

  return (
    <main>
      <PageHeader title={__("main.title")}>
        <AddButton onClick={openModal}>{__("main.add-btn")}</AddButton>
      </PageHeader>

      <Paper p={0}>
        <ProductTagDatatable
          records={data?.data ?? []}
          fetching={isLoading}
          totalRecords={data?.total ?? 0}
          {...datatable}
        />
      </Paper>

      <CreateProductTagModal opened={open} onClose={closeModal} />
    </main>
  );
}
