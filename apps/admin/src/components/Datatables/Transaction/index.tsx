"use client";
import TransactionStatusBadge from "@/components/Badges/TransactionStatus";
import TransactionTypeBadge from "@/components/Badges/TransactionType";
import { useGetTransactionsQuery } from "@/features/transaction/transactionApi";
import { useAppSelector } from "@/hooks";
import { useAppRouter } from "@/hooks/useAppRouter";
import useDatatable from "@/hooks/useDatatable";
import { useTransactionActions } from "@/hooks/useTransactionActions";
import {
  AdminTransactionResponse,
  ENUM_TRANSACTION_STATUS,
} from "@pawpal/shared";
import { DataTable } from "@pawpal/ui/core";
import { sortBy } from "lodash";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import TableAction, { Action } from "../action";
import { RelativeTime } from "./RelativeTime";

const TransactionDatatable = () => {
  const appRouter = useAppRouter();
  const __ = useTranslations("Datatable.transaction");
  const format = useFormatter();
  const datatable = useDatatable<AdminTransactionResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "asc",
    },
    columns: [
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
        render: (record) => <TransactionTypeBadge type={record.type} />,
      },
      {
        accessor: "status",
        noWrap: true,
        title: __("status"),
        render: (record) => <TransactionStatusBadge status={record.status} />,
      },
      {
        accessor: "amount",
        noWrap: true,
        sortable: true,
        title: __("amount"),
        render: (record) => format.number(record.amount, "currency"),
      },
      {
        accessor: "balanceBefore",
        noWrap: true,
        sortable: true,
        title: __("balanceBefore"),
        render: (record) => format.number(record.balanceBefore, "currency"),
      },
      {
        accessor: "balanceAfter",
        noWrap: true,
        sortable: true,
        title: __("balanceAfter"),
        render: (record) => format.number(record.balanceAfter, "currency"),
      },
      {
        accessor: "createdAt",
        noWrap: true,
        sortable: true,
        title: __("createdAt"),
        render: (record) => <RelativeTime date={record.createdAt} />,
      },
      {
        accessor: "order_id",
        noWrap: true,
        sortable: true,
        title: __("order"),
        render: ({ orderId }) => orderId || __("orderNone"),
      },
      {
        accessor: "actions",
        noWrap: true,
        title: __("actions"),
        render: (records) => {
          const actions: Action[] = [
            {
              label: __("action.detail"),
              color: "blue",
              action: appRouter.path("job.transactions.view", {
                id: records.id,
              }),
            },
            {
              label: __("action.make_success"),
              color: "green",
              action: () => successJobTransaction(records.id) as unknown,
            },
            {
              label: __("action.make_fail"),
              color: "red",
              action: () => failJobTransaction(records.id) as unknown,
            },
          ];

          return <TableAction label={__("actions")} actions={actions} />;
        },
      },
    ],
  });

  const { isLoading } = useGetTransactionsQuery({});

  const transactions = useAppSelector((state) => state.job.transactions);
  const [records, setRecords] = useState<AdminTransactionResponse[]>([]);

  const {
    successJobTransaction,
    failJobTransaction,
    isLoading: isTransactionLoading,
  } = useTransactionActions();

  useEffect(() => {
    const data = sortBy(transactions, datatable.sortStatus.columnAccessor);
    const sortedData =
      datatable.sortStatus.direction === "desc" ? [...data].reverse() : data;

    const createdData = sortedData.filter(
      (t) => t.status == ENUM_TRANSACTION_STATUS.CREATED,
    );

    const pendingData = sortedData.filter(
      (t) => t.status == ENUM_TRANSACTION_STATUS.PENDING,
    );

    setRecords([...pendingData, ...createdData]);
  }, [transactions, datatable.sortStatus]);

  return (
    <DataTable
      idAccessor="id"
      records={records}
      fetching={isLoading || isTransactionLoading}
      totalRecords={0} /* TODO: Get total records from API */
      {...datatable.props}
    />
  );
};

export default TransactionDatatable;
