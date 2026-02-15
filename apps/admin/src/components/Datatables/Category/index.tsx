"use client";
import useDatatable from "@/hooks/useDatatable";
import { IconEdit } from "@pawpal/icons";
import { AdminCategoryResponse } from "@pawpal/shared";
import { DataTable } from "@pawpal/ui/core";
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
  const datatable = useDatatable<AdminCategoryResponse>({
    columns: [
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
              /*             ...(onDelete 
                ? [
                    {
                      color: "red",
                      icon: IconTrash,
                      action: onDelete(record.id),
                    },
                  ]
                : []), */
            ]}
          />
        ),
      },
    ],
  });

  return (
    <DataTable
      idAccessor="id"
      records={records}
      totalRecords={totalRecords}
      fetching={fetching}
      {...datatable.props}
    />
  );
};

export default CategoryDatatable;
