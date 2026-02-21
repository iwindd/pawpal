"use client";
import TopupStatusBadge from "@/components/Badges/TopupStatusBadge";
import { useGetEmployeeTopupsQuery } from "@/features/employee/employeeApi";
import { useAppSelector } from "@/hooks";
import useDatatable from "@/hooks/useDatatable";
import { AdminTransactionResponse } from "@pawpal/shared";
import { Box, DataTable } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const ProfileTopupHistoryPage = () => {
  const session = useAppSelector((state) => state.auth.user)!;
  const format = useFormatter();
  const __ = useTranslations("Datatable.transaction");
  const datatable = useDatatable<AdminTransactionResponse>({
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

  const { data, isLoading } = useGetEmployeeTopupsQuery({
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

export default ProfileTopupHistoryPage;
