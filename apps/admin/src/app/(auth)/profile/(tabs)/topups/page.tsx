"use client";
import TopupStatusBadge from "@/components/Badges/TopupStatusBadge";
import { useGetEmployeeTopupsQuery } from "@/features/employee/employeeApi";
import { useAppSelector } from "@/hooks";
import useDatatable from "@/hooks/useDatatable";
import { Box, DataTable } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const ProfileTopupHistoryPage = () => {
  const session = useAppSelector((state) => state.auth.user)!;
  const format = useFormatter();
  const __ = useTranslations("Datatable.transaction");
  const { ...datatable } = useDatatable<any>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
  });

  const { data, isLoading } = useGetEmployeeTopupsQuery({
    id: session.id,
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
      title: __("id"),
    },
    {
      accessor: "amount",
      title: __("amount"),
      render: ({ amount }: any) =>
        format.number(+amount, {
          style: "currency",
          currency: "THB",
        }),
    },
    {
      accessor: "status",
      title: __("status"),
      render: ({ status }: any) => <TopupStatusBadge status={status} />,
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

export default ProfileTopupHistoryPage;
