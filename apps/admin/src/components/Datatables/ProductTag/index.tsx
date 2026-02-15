import { Badge, DataTable, DataTableProps } from "@pawpal/ui/core";
import { useFormatter, useNow, useTranslations } from "next-intl";

import { IconEdit, IconSettings, IconUser } from "@pawpal/icons";
import { AdminProductTagResponse, ProductTagType } from "@pawpal/shared";
import TableAction from "../action";
import { BaseDatatableProps } from "../datatable";

interface Props extends BaseDatatableProps<AdminProductTagResponse> {}

export default function ProductTagDatatable({
  records,
  fetching,
  totalRecords,
  limit,
  page,
  setPage,
  sortStatus,
  setSortStatus,
}: Props) {
  const __ = useTranslations("ProductTag");
  const format = useFormatter();
  const now = useNow();

  const columns: DataTableProps<AdminProductTagResponse>["columns"] = [
    {
      accessor: "name",
      title: __("table.name"),
      sortable: true,
    },
    {
      accessor: "slug",
      title: __("table.slug"),
      sortable: true,
    },
    {
      accessor: "type",
      title: __("table.type"),
      sortable: true,
      render: (record) => {
        const isSystem = record.type === ProductTagType.SYSTEM;
        return (
          <Badge
            color={isSystem ? "blue" : "gray"}
            variant="light"
            leftSection={
              isSystem ? <IconSettings size={12} /> : <IconUser size={12} />
            }
          >
            {__(`type.${record.type}`)}
          </Badge>
        );
      },
    },
    {
      accessor: "createdAt",
      title: __("table.createdAt"),
      sortable: true,
      render: (record) => (
        <span title={format.dateTime(new Date(record.createdAt), "dateTime")}>
          {format.relativeTime(new Date(record.createdAt), now)}
        </span>
      ),
    },
    {
      accessor: "actions",
      title: "",
      width: 100,
      textAlign: "center",
      render: (record) => (
        <TableAction
          displayType="icon"
          actions={[
            {
              color: "blue",
              icon: IconEdit,
              action: `/tags/${record.id}`,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      height="83.4dvh"
      minHeight={400}
      maxHeight={1000}
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
}
