"use client";
import ProductDatatable from "@/components/Datatables/Product";
import PageHeader from "@/components/Pages/PageHeader";
import { pather } from "@/configs/route";
import useDatatable from "@/hooks/useDatatable";
import API from "@/libs/api/client";
import { IconPlus } from "@pawpal/icons";
import { AdminProductResponse } from "@pawpal/shared";
import { Button, Paper } from "@pawpal/ui/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const datatable = useDatatable<AdminProductResponse>();
  const __ = useTranslations("Product");
  const { data, isFetching } = useQuery({
    queryKey: [
      "products",
      datatable.page,
      datatable.sortStatus.columnAccessor,
      datatable.sortStatus.direction,
    ],
    queryFn: () =>
      API.product.list({
        page: datatable.page,
        limit: datatable.limit,
        sort: datatable.sortStatus,
      }),
  });

  return (
    <div>
      <PageHeader title={__("main.title")}>
        <Button
          component={Link}
          variant="outline"
          rightSection={<IconPlus size={14} />}
          href={pather("products.create")}
        >
          {__("main.add-btn")}
        </Button>
      </PageHeader>

      <Paper p={0}>
        <ProductDatatable
          records={data?.data.data ?? []}
          fetching={isFetching}
          totalRecords={data?.data.total ?? 0}
          {...datatable}
        />
      </Paper>
    </div>
  );
}
