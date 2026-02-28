"use client";

import { useGetProductStockMovementsQuery } from "@/features/productApi/productApi";
import useDatatable from "@/hooks/useDatatable";
import { StockMovementListItem } from "@pawpal/shared";
import { Badge, DataTable, RelativeTime } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const StockMovementDatatable = ({ productId }: { productId: string }) => {
  const format = useFormatter();
  const __ = useTranslations("Product.stock");

  const datatable = useDatatable<StockMovementListItem>({
    limit: 6,
    columns: [
      {
        accessor: "createdAt",
        title: __("datatable.date"),
        render: (record: StockMovementListItem) => (
          <RelativeTime date={new Date(record.createdAt)} />
        ),
      },
      {
        accessor: "type",
        title: __("datatable.type"),
        render: (record: StockMovementListItem) => (
          <Badge
            color={record.type === "ORDER" ? "blue" : "gray"}
            variant="light"
          >
            {record.type}
          </Badge>
        ),
      },
      {
        accessor: "quantity",
        title: __("datatable.quantity"),
        textAlign: "right",
        render: (record: StockMovementListItem) => (
          <span
            style={{
              color:
                record.quantity > 0
                  ? "var(--mantine-color-green-7)"
                  : "var(--mantine-color-red-7)",
              fontWeight: 500,
            }}
          >
            {record.quantity > 0 ? "+" : ""}
            {format.number(record.quantity)}
          </span>
        ),
      },
      {
        accessor: "user.name",
        title: __("datatable.user"),
        render: (record: StockMovementListItem) => record.user?.name || "-",
      },
      {
        accessor: "note",
        title: __("datatable.note"),
        render: (record: StockMovementListItem) => record.note || "-",
      },
    ],
  });

  const { data, isFetching } = useGetProductStockMovementsQuery({
    productId,
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sort,
  });

  return (
    <DataTable
      records={data?.data || []}
      totalRecords={data?.total || 0}
      fetching={isFetching}
      {...datatable.props}
      height={"auto"}
      minHeight={"314px"}
    />
  );
};

export default StockMovementDatatable;
