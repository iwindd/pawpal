"use client";
import { useAppRouter } from "@/hooks/useAppRouter";
import { IconEdit } from "@pawpal/icons";
import { AdminProductResponse } from "@pawpal/shared";
import { DataTable, DataTableProps } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";
import { BaseDatatableProps } from "../datatable";

interface Props extends BaseDatatableProps<AdminProductResponse> {}

const ProductDatatable = ({
  records,
  totalRecords,
  limit,
  page,
  setPage,
  fetching,
  sortStatus,
  setSortStatus,
  above,
}: Props) => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.product");
  const appRouter = useAppRouter();

  const columns: DataTableProps<AdminProductResponse>["columns"] = [
    {
      accessor: "name",
      noWrap: true,
      sortable: true,
      title: __("name"),
    },
    {
      accessor: "category.name",
      noWrap: true,
      sortable: true,
      title: __("category"),
      visibleMediaQuery: above.xs,
    },
    {
      accessor: "productTags._count",
      noWrap: true,
      sortable: true,
      render: (value) => "-", // TODO:: Show product tags
      title: __("productTags"),
      visibleMediaQuery: above.md,
    },
    {
      accessor: "packages._count",
      noWrap: true,
      sortable: true,
      title: __("packages"),
      render: (value) =>
        __("packageFormat", {
          count: format.number(value.packageCount, "count"),
        }),
    },
    {
      accessor: "createdAt",
      noWrap: true,
      sortable: true,
      title: __("createdAt"),
      render: (value) => format.dateTime(new Date(value.createdAt), "date"),
      visibleMediaQuery: above.md,
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 100,
      textAlign: "center",
      render: (record) => (
        <TableAction
          displayType="icon"
          actions={[
            {
              color: "blue",
              icon: IconEdit,
              action: appRouter.path("products.product", {
                id: record.id,
              }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      striped
      highlightOnHover
      height="83.4dvh"
      minHeight={400}
      maxHeight={1000}
      idAccessor="slug"
      columns={columns}
      records={records}
      totalRecords={totalRecords}
      recordsPerPage={limit}
      page={page}
      onPageChange={setPage}
      fetching={fetching}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  );
};

export default ProductDatatable;
