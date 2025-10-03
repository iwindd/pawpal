"use client";
import ProductDatatable from "@/components/Datatables/Product";
import { ROUTES } from "@/configs/route";
import useDatatable from "@/hooks/useDatatable";
import API from "@/libs/api/client";
import { AdminProductResponse } from "@pawpal/shared";
import { Button, Group, Paper, Title } from "@pawpal/ui/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const datatable = useDatatable<AdminProductResponse>();
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
      <Group justify="space-between" mb="md">
        <Title order={2}>Products</Title>
        <Button
          component={Link}
          href={ROUTES["products"]?.children?.create?.path as string}
        >
          Create
        </Button>
      </Group>

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
