"use client";
import { useGetEmployeesQuery } from "@/features/employee/employeeApi";
import useDatatable from "@/hooks/useDatatable";
import { IconEye } from "@pawpal/icons";
import { AdminEmployeeResponse } from "@pawpal/shared";
import {
  Avatar,
  DataTable,
  DataTableProps,
  Group,
  Text,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";

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
    sort: datatable.sort,
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
    {
      accessor: "actions",
      noWrap: true,
      title: __("actions"),
      render: (record) => (
        <TableAction
          displayType="icon"
          actions={[
            {
              translate: "view",
              action: `/users/employees/${record.id}`,
              icon: IconEye,
              color: "blue",
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
