"use client";
import TopupStatusBadge from "@/components/Badges/TopupStatusBadge";
import { useGetCustomerTopupsQuery } from "@/features/customer/customerApi";
import useDatatable from "@/hooks/useDatatable";
import { Box, DataTable } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useCustomer } from "../../CustomerContext";

const CustomerTopupsPage = () => {
  const { customer } = useCustomer();
  const format = useFormatter();
  const __ = useTranslations("Datatable.transaction");
  const datatable = useDatatable<any>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
    columns: [
      {
        accessor: "id",
        render: (record) => `#${record.id.slice(-8)}`,
        title: __("id"),
      },
      {
        accessor: "amount",
        title: __("amount"),
        render: ({ amount }) =>
          format.number(+amount, {
            style: "currency",
            currency: "THB",
          }),
      },
      {
        accessor: "status",
        title: __("status"),
        render: ({ status }) => <TopupStatusBadge status={status} />,
      },
      {
        accessor: "createdAt",
        title: __("createdAt"),
        render: (record) =>
          format.dateTime(new Date(record.createdAt), "dateTime"),
      },
    ],
  });

  const { data, isLoading } = useGetCustomerTopupsQuery({
    id: customer.id,
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

export default CustomerTopupsPage;
