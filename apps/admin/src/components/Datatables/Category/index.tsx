"use client";
import { IconEdit, IconTrash } from "@pawpal/icons";
import { AdminCategoryResponse } from "@pawpal/shared";
import { DataTable, DataTableProps } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";
import { BaseDatatableProps } from "../datatable";

interface Props extends BaseDatatableProps<AdminCategoryResponse> {}

const CategoryDatatable = ({
  records,
  totalRecords,
  limit,
  page,
  setPage,
  fetching,
  sortStatus,
  setSortStatus,
  above,
  onDelete, // Assuming BaseDatatableProps includes onDelete or similar if we want delete action
}: Props & { onDelete?: (id: string) => void }) => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.category");

  const columns: DataTableProps<AdminCategoryResponse>["columns"] = [
    {
      accessor: "name",
      noWrap: true,
      sortable: true,
      title: __("name"),
    },
    {
      accessor: "slug",
      noWrap: true,
      sortable: true,
      title: __("slug"),
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
      title: __("actions"),
      width: 100,
      textAlign: "center",
      render: (record) => (
        <TableAction
          displayType="icon"
          actions={[
            {
              color: "blue",
              icon: IconEdit,
              action: `/categories/${record.id}`,
            },
            ...(onDelete
              ? [
                  {
                    color: "red",
                    icon: IconTrash,
                    onClick: () => onDelete(record.id),
                  },
                ]
              : []),
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

export default CategoryDatatable;
