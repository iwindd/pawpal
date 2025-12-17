"use client";
import { AdminOrderResponse } from "@pawpal/shared";
import { Group, Paper, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

const OrderFieldPartial = (order: AdminOrderResponse) => {
  const __ = useTranslations("Order.view");

  if (!order.fields || order.fields.length === 0) {
    return null;
  }

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        {__("sections.additional")}
      </Title>
      <Stack gap="xs">
        {order.fields.map((field) => (
          <Group key={field.label} justify="space-between">
            <Text size="sm" c="dimmed">
              {field.label}
            </Text>
            <Text size="sm" fw={500}>
              {field.value}
            </Text>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
};

export default OrderFieldPartial;
