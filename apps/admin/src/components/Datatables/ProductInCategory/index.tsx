"use client";
import { IconEdit } from "@pawpal/icons";
import { AdminProductResponse } from "@pawpal/shared";
import { DataTable, DataTableProps } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";
import { BaseDatatableProps } from "../datatable";

interface Props extends BaseDatatableProps<AdminProductResponse> {}

const ProductInCategoryDatatable = ({
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
  const columns: DataTableProps<AdminProductResponse>["columns"] = [
    {
      accessor: "name",
      noWrap: true,
      sortable: true,
      title: __("name"),
    },
    {
      accessor: "productTags._count",
      noWrap: true,
      sortable: true,
      render: (value) => "-",
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
              action: `/products/${record.id}`,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      idAccessor="id"
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

export default ProductInCategoryDatatable;
