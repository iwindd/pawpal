"use client";
import { useGetEmployeesQuery } from "@/features/employee/employeeApi";
import { useImpersonateUserMutation } from "@/features/user/userApi";
import useDatatable from "@/hooks/useDatatable";
import { IconEye, IconUserBolt } from "@pawpal/icons";
import { AdminEmployeeResponse } from "@pawpal/shared";
import { Avatar, DataTable, Group, Text } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";

const EmployeeDatatable = () => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.employee");
  const __action = useTranslations("Datatable.Action");
  const [impersonateUser] = useImpersonateUserMutation();
  const datatable = useDatatable<AdminEmployeeResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
    columns: ({ above }) => [
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
                label: __action("view"),
                action: `/users/employees/${record.id}`,
                icon: IconEye,
                color: "blue",
              },
              {
                label: __action("impersonate"),
                action: async () => {
                  const res = await impersonateUser(record.id);
                  if (!("error" in res)) {
                    window.location.href = "/";
                  }
                },
                icon: IconUserBolt,
                color: "red",
                divider: true,
              },
            ]}
          />
        ),
      },
    ],
  });

  const { data, isLoading } = useGetEmployeesQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sort,
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

export default EmployeeDatatable;
