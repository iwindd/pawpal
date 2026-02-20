"use client";
import { useGetCustomerSuspensionsQuery } from "@/features/customer/customerApi";
import { useGetEmployeeSuspensionsQuery } from "@/features/employee/employeeApi";
import useDatatable from "@/hooks/useDatatable";
import { AdminUserSuspensionResponse } from "@pawpal/shared";
import { Badge, DataTable, Text } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

interface SuspensionHistoryDatatableProps {
  userId: string;
  type: "customer" | "employee";
}

const SuspensionHistoryDatatable = ({
  userId,
  type,
}: SuspensionHistoryDatatableProps) => {
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

  const queryParams = {
    id: userId,
    params: {
      page: datatable.page,
      limit: datatable.limit,
      sort: datatable.sort,
    },
  };

  const customerQuery = useGetCustomerSuspensionsQuery(queryParams, {
    skip: type !== "customer",
  });
  const employeeQuery = useGetEmployeeSuspensionsQuery(queryParams, {
    skip: type !== "employee",
  });

  const query = type === "customer" ? customerQuery : employeeQuery;
  const { data, isLoading } = query;

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

export default SuspensionHistoryDatatable;
