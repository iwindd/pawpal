"use client";
import TransactionStatusBadge from "@/components/Badges/TransactionStatus";
import TransactionTypeBadge from "@/components/Badges/TransactionType";
import { Card, Grid, Stack, Text } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useTransaction } from "./TransactionContext";

export default function TransactionDetailPage() {
  const { transaction } = useTransaction();
  const __ = useTranslations("Transaction");
  const format = useFormatter();

  const customerName = transaction.order?.user
    ? `${transaction.order.user.firstName} ${transaction.order.user.lastName}`
    : "Unknown Customer";

  return (
    <Stack gap="md">
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
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
                      {__("detail.createdAt")}
                    </Text>
                    <Text fw={500}>
                      {format.dateTime(new Date(transaction.createdAt), {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text c="dimmed" size="sm">
                      {__("detail.paymentGateway")}
                    </Text>
                    <Text fw={500}>
                      {transaction.paymentGateway?.name || "N/A"}
                    </Text>
                  </Grid.Col>
                  {transaction.orderId && (
                    <Grid.Col span={12}>
                      <Text c="dimmed" size="sm">
                        {__("detail.orderId")}
                      </Text>
                      <Text fw={500}>{transaction.orderId}</Text>
                    </Grid.Col>
                  )}
                </Grid>
              </Card.Content>
            </Card>

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
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
