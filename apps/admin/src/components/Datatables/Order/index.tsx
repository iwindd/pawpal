"use client";
import { pather } from "@/configs/route";
import useDatatable from "@/hooks/useDatatable";
import API from "@/libs/api/client";
import { IconEdit } from "@pawpal/icons";
import { AdminOrderResponse } from "@pawpal/shared";
import {
  Breadcrumbs,
  DataTable,
  DataTableProps,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";
import { BaseDatatableProps } from "../datatable";

interface Props extends BaseDatatableProps<AdminOrderResponse> {}

const OrderDatatable = () => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.order");
  const { above, ...datatable } = useDatatable<AdminOrderResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
  });

  const { data, isFetching } = useQuery({
    queryKey: [
      "orders",
      datatable.page,
      datatable.sortStatus.columnAccessor,
      datatable.sortStatus.direction,
    ],
    queryFn: () =>
      API.order.list({
        page: datatable.page,
        limit: datatable.limit,
        sort: datatable.sortStatus,
      }),
  });

  const columns: DataTableProps<AdminOrderResponse>["columns"] = [
    {
      accessor: "id",
      noWrap: true,
      sortable: true,
      title: __("orderId"),
      render: (record) => `#${record.id.slice(-8)}`,
    },
    {
      accessor: "user.displayName",
      noWrap: true,
      sortable: true,
      title: __("customer"),
      render: (record) => (
        <div>
          <Title order={6}>{record.user.displayName}</Title>
          <Text size="xs" c="dimmed">
            {record.user.email}
          </Text>
        </div>
      ),
    },
    {
      accessor: "orderPackages",
      noWrap: true,
      title: __("items"),
      render: (record) => {
        const mainPackage = record.orderPackages[0];
        if (!mainPackage) return <Text size="sm">-</Text>;

        return (
          <div>
            <Breadcrumbs separator="x" separatorMargin={"xs"}>
              <Text size="sm">{mainPackage.package.name}</Text>
              <Text size="sm">
                {format.number(mainPackage.amount, "amount")}
              </Text>
            </Breadcrumbs>
            <Breadcrumbs separator="|" separatorMargin={"xs"}>
              <Text c="dimmed" size="xs">
                {mainPackage.package.product.category.name}
              </Text>
              <Text c="dimmed" size="xs">
                {mainPackage.package.product.name}
                {record.orderPackages.length > 1 && "..."}
              </Text>
            </Breadcrumbs>
          </div>
        );
      },
      visibleMediaQuery: above.md,
    },
    {
      accessor: "total",
      noWrap: true,
      sortable: true,
      title: __("total"),
      render: (record) =>
        format.number(parseFloat(record.total), {
          style: "currency",
          currency: "THB",
        }),
    },
    {
      accessor: "status",
      noWrap: true,
      sortable: true,
      title: __("status"),
    },
    {
      accessor: "createdAt",
      noWrap: true,
      sortable: true,
      title: __("createdAt"),
      render: (record) =>
        format.dateTime(new Date(record.createdAt), "dateTime"),
      visibleMediaQuery: above.sm,
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
              action: pather("job.orders.edit", { id: record.id }),
              icon: IconEdit,
              color: "blue",
            },
          ]}
        />
      ),
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
      records={data?.data.data ?? []}
      totalRecords={data?.data.total ?? 0}
      recordsPerPage={datatable.limit}
      page={datatable.page}
      onPageChange={datatable.setPage}
      fetching={isFetching}
      sortStatus={datatable.sortStatus}
      onSortStatusChange={datatable.setSortStatus}
    />
  );
};

export default OrderDatatable;
