"use client";
import TransactionStatusBadge from "@/components/Badges/TransactionStatus";
import TransactionTypeBadge from "@/components/Badges/TransactionType";
import { Card, Grid, Text } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useTransaction } from "../TransactionContext";
const TransactionDetailCard = () => {
  const { transaction } = useTransaction();
  const __ = useTranslations("Transaction");
  const format = useFormatter();

  const customerName = transaction.customer.displayName;

  return (
    <Card>
      <Card.Header title={__("detail.title")} />
      <Card.Content>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text c="dimmed" size="sm">
              {__("detail.transactionId")}
            </Text>
            <Text fw={500}>{transaction.id}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text c="dimmed" size="sm">
              {__("detail.customer")}
            </Text>
            <Text fw={500}>{customerName}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text c="dimmed" size="sm">
              {__("detail.type")}
            </Text>
            <TransactionTypeBadge type={transaction.type} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text c="dimmed" size="sm">
              {__("detail.status")}
            </Text>
            <TransactionStatusBadge status={transaction.status} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text c="dimmed" size="sm">
              {__("detail.paymentGateway")}
            </Text>
            <Text fw={500}>{transaction.paymentGateway?.name || "N/A"}</Text>
          </Grid.Col>
        </Grid>
      </Card.Content>
    </Card>
  );
};

export default TransactionDetailCard;
