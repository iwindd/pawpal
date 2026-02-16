import { Badge, DataTable } from "@pawpal/ui/core";
import { useFormatter, useNow, useTranslations } from "next-intl";

import { useGetTagsQuery } from "@/features/tag/tagApi";
import useDatatable from "@/hooks/useDatatable";
import { IconEdit, IconSettings, IconUser } from "@pawpal/icons";
import { AdminTagResponse, TagType } from "@pawpal/shared";
import TableAction from "../action";

export default function TagDatatable() {
  const __ = useTranslations("Tag");
  const format = useFormatter();
  const now = useNow();
  const datatable = useDatatable<AdminTagResponse>({
    columns: [
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
          const isSystem = record.type === TagType.SYSTEM;
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
    ],
  });

  const { data, isLoading } = useGetTagsQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sort,
  });

  return (
    <DataTable
      records={data?.data ?? []}
      totalRecords={data?.total ?? 0}
      fetching={isLoading}
      {...datatable.props}
    />
  );
}
