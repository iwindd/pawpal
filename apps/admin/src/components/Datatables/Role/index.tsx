"use client";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "@/features/role/roleApi";
import useDatatable from "@/hooks/useDatatable";
import { IconEdit, IconTrash } from "@pawpal/icons";
import { AdminRoleResponse } from "@pawpal/shared";
import { Badge, DataTable, Group, Text } from "@pawpal/ui/core";
import { useConfirmation } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";

const RoleDatatable = () => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.role");
  const _r = useTranslations("Role");
  const { confirmation } = useConfirmation();
  const [deleteRole] = useDeleteRoleMutation();

  const { above, ...datatable } = useDatatable<AdminRoleResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
    columns: ({ above }) => [
      {
        accessor: "name",
        noWrap: true,
        sortable: true,
        title: __("name"),
      },
      {
        accessor: "description",
        noWrap: false,
        title: __("description"),
        render: (record) => (
          <Text
            size="sm"
            c={record.description ? "inherit" : "dimmed"}
            lineClamp={1}
          >
            {record.description || "-"}
          </Text>
        ),
        visibleMediaQuery: above.md,
      },
      {
        accessor: "permissions",
        noWrap: true,
        title: __("permissions"),
        render: (record) => (
          <Group gap={4}>
            {record.permissions.length > 0 ? (
              <Badge variant="light" size="sm">
                {__("permissionCount", { count: record.permissions.length })}
              </Badge>
            ) : (
              <Text size="sm" c="dimmed">
                -
              </Text>
            )}
          </Group>
        ),
        visibleMediaQuery: above.sm,
      },
      {
        accessor: "_count.users",
        noWrap: true,
        title: __("users"),
        render: (record) => (
          <Badge variant="light" color="blue" size="sm">
            {__("userCount", { count: record._count.users })}
          </Badge>
        ),
        visibleMediaQuery: above.sm,
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
                translate: "edit",
                action: `/roles/${record.id}`,
                icon: IconEdit,
                color: "blue",
              },
              {
                translate: "delete",
                icon: IconTrash,
                color: "red",
                action: () =>
                  confirmation(
                    async () => {
                      const res = await deleteRole(record.id);
                      if (!("error" in res)) {
                        notify.show({
                          color: "green",
                          message: _r("notify.deleteSuccess"),
                        });
                      }
                    },
                    {
                      title: _r("confirm.deleteTitle"),
                      message: _r("confirm.deleteMessage"),
                    },
                  ),
              },
            ]}
          />
        ),
      },
    ],
  });

  const { data, isLoading } = useGetRolesQuery({
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

export default RoleDatatable;
