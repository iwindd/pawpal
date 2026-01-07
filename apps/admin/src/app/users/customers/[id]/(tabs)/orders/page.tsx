"use client";
import OrderStatusBadge from "@/components/Badges/OrderStatus";
import { useGetCustomerOrdersQuery } from "@/features/customer/customerApi";
import useDatatable from "@/hooks/useDatatable";
import { AdminOrderResponse } from "@pawpal/shared";
import { Box, DataTable } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useCustomer } from "../../CustomerContext";

const CustomerOrdersPage = () => {
  const { customer } = useCustomer();
  const format = useFormatter();
  const __ = useTranslations("Datatable.order");
  const { above, ...datatable } = useDatatable<AdminOrderResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
  });

  const { data, isLoading } = useGetCustomerOrdersQuery({
    id: customer.id,
    params: {
      page: datatable.page,
      limit: datatable.limit,
      sort: datatable.sort,
    },
  });

  const columns = [
    {
      accessor: "id",
      render: (record: any) => `#${record.id.slice(-8)}`,
      title: __("orderId"),
    },
    {
      accessor: "total",
      title: __("total"),
      render: ({ total }: any) =>
        format.number(+total, {
          style: "currency",
          currency: "THB",
        }),
    },
    {
      accessor: "status",
      title: __("status"),
      render: ({ status }: any) => <OrderStatusBadge status={status} />,
    },
    {
      accessor: "createdAt",
      title: __("createdAt"),
      render: (record: any) =>
        format.dateTime(new Date(record.createdAt), "dateTime"),
    },
  ];

  return (
    <Box py="md">
      <DataTable
        withTableBorder
        borderRadius="sm"
        striped
        highlightOnHover
        minHeight={300}
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
    </Box>
  );
};

export default CustomerOrdersPage;
