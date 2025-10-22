"use client";
import useDatatable from "@/hooks/useDatatable";
import API from "@/libs/api/client";
import {
  AdminTransactionResponse,
  ENUM_TRANSACTION_STATUS,
} from "@pawpal/shared";
import { DataTable, DataTableProps } from "@pawpal/ui/core";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import TableAction, { Action } from "../action";

const TransactionDatatable = () => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.transaction");
  const { above, ...datatable } = useDatatable<AdminTransactionResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
  });

  const { data, isFetching } = useQuery({
    queryKey: [
      "transactions",
      datatable.page,
      datatable.sortStatus.columnAccessor,
      datatable.sortStatus.direction,
    ],
    queryFn: () =>
      API.transaction.getPendingTransactions({
        page: datatable.page,
        limit: datatable.limit,
        sort: datatable.sortStatus,
      }),
  });

  const columns: DataTableProps<AdminTransactionResponse>["columns"] = [
    {
      accessor: "id",
      noWrap: true,
      sortable: true,
      title: __("transactionId"),
      render: (record) => `#${record.id.slice(-8)}`,
    },
    {
      accessor: "type",
      noWrap: true,
      sortable: true,
      title: __("type"),
      render: (record) => __(`types.${record.type.toLowerCase()}`),
    },
    {
      accessor: "amount",
      noWrap: true,
      sortable: true,
      title: __("amount"),
      render: (record) => format.number(record.amount, "currency"),
    },
    {
      accessor: "balance_before",
      noWrap: true,
      sortable: true,
      title: __("balanceBefore"),
      render: (record) => format.number(record.balance_before, "currency"),
    },
    {
      accessor: "balance_after",
      noWrap: true,
      sortable: true,
      title: __("balanceAfter"),
      render: (record) => format.number(record.balance_after, "currency"),
    },
    {
      accessor: "createdAt",
      noWrap: true,
      sortable: true,
      title: __("createdAt"),
      render: (record) =>
        format.dateTime(new Date(record.createdAt), "dateTime"),
    },
    {
      accessor: "order_id",
      noWrap: true,
      sortable: true,
      title: __("order"),
      render: ({ order_id }) => order_id || __("orderNone"),
    },
    {
      accessor: "actions",
      noWrap: true,
      title: __("actions"),
      render: (records) => {
        const actions: Action[] = [];

        if (records.status === ENUM_TRANSACTION_STATUS.PENDING) {
          actions.push(
            {
              label: __("action.make_success"),
              color: "green",
              action: () => {},
            },
            {
              label: __("action.make_failed"),
              color: "red",
              action: () => {},
            }
          );
        }

        return <TableAction label={__("actions")} actions={actions} />;
      },
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

export default TransactionDatatable;
