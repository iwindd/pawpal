"use client";
import OrderStatusBadge from "@/components/Badges/OrderStatus";
import { useGetEmployeeOrdersQuery } from "@/features/employee/employeeApi";
import { useAppSelector } from "@/hooks";
import useDatatable from "@/hooks/useDatatable";
import { AdminOrderResponse } from "@pawpal/shared";
import { Box, DataTable } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const ProfileOrderHistoryPage = () => {
  const session = useAppSelector((state) => state.auth.user)!;
  const format = useFormatter();
  const __ = useTranslations("Datatable.order");
  const datatable = useDatatable<AdminOrderResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
    columns: [
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
    ],
  });

  const { data, isLoading } = useGetEmployeeOrdersQuery({
    id: session.id,
    params: {
      page: datatable.page,
      limit: datatable.limit,
      sort: datatable.sort,
    },
  });

  return (
    <Box py="md">
      <DataTable
        idAccessor="id"
        records={data?.data || []}
        totalRecords={data?.total || 0}
        fetching={isLoading}
        {...datatable.props}
      />
    </Box>
  );
};

export default ProfileOrderHistoryPage;
