"use client";
import { AdminOrderResponse } from "@pawpal/shared";
import { Divider, Group, Paper, Stack, Text, Title } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const SummaryPartial = (order: AdminOrderResponse) => {
  const __ = useTranslations("Order.view");
  const formatter = useFormatter();

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        {__("sections.summary")}
      </Title>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {__("summary.subtotal")}
          </Text>
          <Text size="sm">{formatter.number(order.total, "currency")}</Text>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Text fw={700}>{__("summary.total")}</Text>
          <Text fw={700} size="lg" c="blue">
            {formatter.number(order.total, "currency")}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
};

export default SummaryPartial;
