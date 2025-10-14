"use client";
import { ROUTES } from "@/configs/route";
import { AdminProductResponse } from "@pawpal/shared";
import { ActionIcon, DataTable, DataTableProps, Group } from "@pawpal/ui/core";
import { IconEdit, IconDelete } from "@pawpal/icons";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
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
      render: (value) => value.productTags.map((tag) => tag.name).join(", "),
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
      render: (record) => (
        <Group gap={4}>
          <ActionIcon
            size="sm"
            variant="light"
            color="blue"
            component={Link}
            href={typeof ROUTES.products?.children?.edit?.path === 'function'
              ? ROUTES.products.children.edit.path(record.id)
              : `/products/${record.id}/edit`}
          >
            <IconEdit size={14} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="light"
            color="red"
          >
            <IconDelete size={14} />
          </ActionIcon>
        </Group>
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
