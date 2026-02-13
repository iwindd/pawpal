"use client";
import TransactionStatusBadge from "@/components/Badges/TransactionStatus";
import TransactionTypeBadge from "@/components/Badges/TransactionType";
import { AdminOrderResponse } from "@pawpal/shared";
import { Paper, Table, Title } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const TransactionHistoryPartial = (order: AdminOrderResponse) => {
  const __ = useTranslations("Order.view");
  const formatter = useFormatter();

  if (!order.transactions || order.transactions.length === 0) {
    return null;
  }

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        {__("sections.transactions")}
      </Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{__("table.type")}</Table.Th>
            <Table.Th>{__("table.status")}</Table.Th>
            <Table.Th>{__("table.paymentMethod")}</Table.Th>
            <Table.Th>{__("table.transferTime")}</Table.Th>
            <Table.Th style={{ textAlign: "right" }}>
              {__("table.amountChange")}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {order.transactions.map((tx) => (
            <Table.Tr key={tx.id}>
              <Table.Td>
                <TransactionTypeBadge type={tx.type} />
              </Table.Td>
              <Table.Td>
                <TransactionStatusBadge status={tx.status} />
              </Table.Td>
              <Table.Td>{tx.payment?.name || "-"}</Table.Td>
              <Table.Td>
                {formatter.dateTime(new Date(tx.createdAt), "dateTime")}
              </Table.Td>
              <Table.Td style={{ textAlign: "right" }}>
                {formatter.number(
                  tx.balanceAfter - tx.balanceBefore,
                  "currency",
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
};

export default TransactionHistoryPartial;
