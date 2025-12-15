"use client";
import { useGetTransactionsQuery } from "@/features/transaction/transactionApi";
import useDatatable from "@/hooks/useDatatable";
import { useTransactionActions } from "@/hooks/useTransactionActions";
import {
  AdminTransactionResponse,
  ENUM_TRANSACTION_STATUS,
} from "@pawpal/shared";
import { DataTable, DataTableProps } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import TableAction, { Action } from "../action";

const TransactionDatatable = () => {
  const __ = useTranslations("Datatable.transaction");
  const format = useFormatter();
  const datatable = useDatatable<AdminTransactionResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "asc",
    },
  });

  const { data, isLoading } = useGetTransactionsQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sort,
  });

  const {
    setFailed,
    setSuccess,
    isLoading: isTransactionLoading,
  } = useTransactionActions();

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
              action: () => setSuccess(records.id) as unknown,
            },
            {
              label: __("action.make_failed"),
              color: "red",
              action: () => setFailed(records.id) as unknown,
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
      records={data?.data || []}
      totalRecords={data?.total || 0}
      recordsPerPage={datatable.limit}
      page={datatable.page}
      onPageChange={datatable.setPage}
      fetching={isLoading || isTransactionLoading}
      sortStatus={datatable.sortStatus}
      onSortStatusChange={datatable.setSortStatus}
    />
  );
};

export default TransactionDatatable;
