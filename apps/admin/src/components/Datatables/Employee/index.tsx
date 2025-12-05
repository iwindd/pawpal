"use client";
import useDatatable from "@/hooks/useDatatable";
import { useGetEmployeesQuery } from "@/services/users";
import { AdminEmployeeResponse } from "@pawpal/shared";
import {
  Avatar,
  DataTable,
  DataTableProps,
  Group,
  Text,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const EmployeeDatatable = () => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.employee");
  const { above, ...datatable } = useDatatable<AdminEmployeeResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
  });

  const { data, isLoading } = useGetEmployeesQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sortStatus,
  });

  const columns: DataTableProps<AdminEmployeeResponse>["columns"] = [
    {
      accessor: "displayName",
      noWrap: true,
      sortable: true,
      title: __("employee"),
      render: (record) => (
        <Group gap="sm">
          <Avatar src={record.avatar} size={40} radius={40} />
          <div>
            <Text size="sm" fw={500}>
              {record.displayName}
            </Text>
            <Text c="dimmed" size="xs">
              {record.email}
            </Text>
          </div>
        </Group>
      ),
    },
    {
      accessor: "createdAt",
      noWrap: true,
      sortable: true,
      title: __("createdAt"),
      render: (record) => format.dateTime(new Date(record.createdAt), "date"),
      visibleMediaQuery: above.lg,
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
      records={data?.data || []}
      totalRecords={data?.total || 0}
      recordsPerPage={15}
      page={datatable.page}
      onPageChange={datatable.setPage}
      fetching={isLoading}
      sortStatus={datatable.sortStatus}
      onSortStatusChange={datatable.setSortStatus}
    />
  );
};

export default EmployeeDatatable;
