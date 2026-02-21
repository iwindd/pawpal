"use client";
import { Card, Grid, Text } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useTransaction } from "../TransactionContext";

const TransactionFinancialCard = () => {
  const { transaction } = useTransaction();
  const __ = useTranslations("Transaction");
  const format = useFormatter();
  return (
    <Card>
      <Card.Header title={__("detail.financials")} />
      <Card.Content>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Text c="dimmed" size="sm">
              {__("detail.amount")}
            </Text>
            <Text fw={700} c="blue" size="xl">
              {format.number(transaction.amount, "currency")}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Text c="dimmed" size="sm">
              {__("detail.balanceBefore")}
            </Text>
            <Text fw={500}>
              {format.number(transaction.balanceBefore, "currency")}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Text c="dimmed" size="sm">
              {__("detail.balanceAfter")}
            </Text>
            <Text fw={500}>
              {format.number(transaction.balanceAfter, "currency")}
            </Text>
          </Grid.Col>
        </Grid>
      </Card.Content>
    </Card>
  );
};

export default TransactionFinancialCard;
