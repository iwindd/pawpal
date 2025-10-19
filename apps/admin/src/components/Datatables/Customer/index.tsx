"use client";
import useDatatable from "@/hooks/useDatatable";
import API from "@/libs/api/client";
import { AdminCustomerResponse } from "@pawpal/shared";
import {
  Avatar,
  DataTable,
  DataTableProps,
  Group,
  Text,
} from "@pawpal/ui/core";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";

const CustomerDatatable = () => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.customer");
  const { above, ...datatable } = useDatatable<AdminCustomerResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
  });

  const { data, isFetching } = useQuery({
    queryKey: [
      "customers",
      datatable.page,
      datatable.sortStatus.columnAccessor,
      datatable.sortStatus.direction,
    ],
    queryFn: () =>
      API.user.getCustomers({
        page: datatable.page,
        limit: datatable.limit,
        sort: datatable.sortStatus,
      }),
  });

  const columns: DataTableProps<AdminCustomerResponse>["columns"] = [
    {
      accessor: "displayName",
      noWrap: true,
      sortable: true,
      title: __("customer"),
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
      accessor: "orderCount",
      noWrap: true,
      sortable: true,
      title: __("orders"),
      render: (record) =>
        __("orderFormat", {
          count: format.number(record.orderCount, "count"),
        }),
      visibleMediaQuery: above.md,
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
      records={data?.data.data || []}
      totalRecords={data?.data.total || 0}
      recordsPerPage={15}
      page={datatable.page}
      onPageChange={datatable.setPage}
      fetching={isFetching}
      sortStatus={datatable.sortStatus}
      onSortStatusChange={datatable.setSortStatus}
    />
  );
};

export default CustomerDatatable;
