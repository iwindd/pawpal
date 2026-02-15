"use client";
import OrderStatusBadge from "@/components/Badges/OrderStatus";
import { getPath } from "@/configs/route";
import { useGetTopupOrdersQuery } from "@/features/order/orderApi";
import { useAppSelector } from "@/hooks";
import useDatatable from "@/hooks/useDatatable";
import { IconEdit } from "@pawpal/icons";
import { AdminOrderResponse } from "@pawpal/shared";
import {
  Breadcrumbs,
  DataTable,
  DataTableProps,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";

const OrderDatatable = () => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.order");
  const { above, ...datatable } = useDatatable<AdminOrderResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
    limit: 100,
  });

  const { isLoading } = useGetTopupOrdersQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sort,
  });

  const orders = useAppSelector((state) => state.job.orders);
  const columns: DataTableProps<AdminOrderResponse>["columns"] = [
    {
      accessor: "id",
      noWrap: true,
      sortable: true,
      title: __("orderId"),
      render: (record) => `#${record.id.slice(-8)}`,
    },
    {
      accessor: "customer.displayName",
      noWrap: true,
      sortable: true,
      title: __("customer"),
      render: ({ customer }) => (
        <div>
          <Title order={6}>{customer.displayName}</Title>
          <Text size="xs" c="dimmed">
            {customer.email}
          </Text>
        </div>
      ),
    },
    {
      accessor: "cart",
      noWrap: true,
      title: __("items"),
      render: ({ cart }) => {
        const mainPackage = cart[0];
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
                {mainPackage.category.name}
              </Text>
              <Text c="dimmed" size="xs">
                {mainPackage.product.name}
                {cart.length > 1 && "..."}
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
      render: ({ total }) =>
        format.number(+total, {
          style: "currency",
          currency: "THB",
        }),
    },
    {
      accessor: "status",
      noWrap: true,
      sortable: true,
      title: __("status"),
      render: ({ status }) => <OrderStatusBadge status={status} />,
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
              action: getPath("job.orders.edit", { id: record.id }),
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
      idAccessor="id"
      columns={columns}
      records={orders}
      totalRecords={orders.length}
      recordsPerPage={datatable.limit}
      page={datatable.page}
      onPageChange={datatable.setPage}
      fetching={isLoading}
      sortStatus={datatable.sortStatus}
      onSortStatusChange={datatable.setSortStatus}
    />
  );
};

export default OrderDatatable;
