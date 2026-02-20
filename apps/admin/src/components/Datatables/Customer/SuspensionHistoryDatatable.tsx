"use client";
import { useGetCustomerSuspensionsQuery } from "@/features/customer/customerApi";
import useDatatable from "@/hooks/useDatatable";
import { AdminUserSuspensionResponse } from "@pawpal/shared";
import { Badge, DataTable, Text } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

interface CustomerSuspensionHistoryDatatableProps {
  userId: string;
}

const CustomerSuspensionHistoryDatatable = ({
  userId,
}: CustomerSuspensionHistoryDatatableProps) => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.suspensionHistory");
  const { above, ...datatable } = useDatatable<AdminUserSuspensionResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
    columns: ({ above }) => [
      {
        accessor: "type",
        noWrap: true,
        sortable: true,
        title: __("type"),
        render: (record) => (
          <Badge
            color={record.type === "SUSPENDED" ? "red" : "green"}
            variant="light"
          >
            {__(record.type.toLowerCase())}
          </Badge>
        ),
      },
      {
        accessor: "note",
        noWrap: false,
        title: __("note"),
        render: (record) => (
          <Text size="sm" c={record.note ? "inherit" : "dimmed"}>
            {record.note || "-"}
          </Text>
        ),
      },
      {
        accessor: "performedBy.displayName",
        noWrap: true,
        title: __("performedBy"),
        render: (record) => record.performedBy.displayName,
      },
      {
        accessor: "createdAt",
        noWrap: true,
        sortable: true,
        title: __("createdAt"),
        render: (record) => format.dateTime(new Date(record.createdAt), "date"),
      },
    ],
  });

  const { data, isLoading } = useGetCustomerSuspensionsQuery({
    id: userId,
    params: {
      page: datatable.page,
      limit: datatable.limit,
      sort: datatable.sort,
    },
  });

  return (
    <DataTable
      idAccessor="id"
      records={data?.data || []}
      totalRecords={data?.total || 0}
      fetching={isLoading}
      {...datatable.props}
    />
  );
};

export default CustomerSuspensionHistoryDatatable;
