"use client";
import { AdminOrderResponse } from "@pawpal/shared";
import { Avatar, Group, Paper, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

const CustomerInfoPartial = (order: AdminOrderResponse) => {
  const __ = useTranslations("Order.view");

  if (!order.transactions || order.transactions.length === 0) {
    return null;
  }

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        {__("sections.customer")}
      </Title>
      <Group>
        <Avatar
          src={null}
          alt={order.customer.displayName}
          size="md"
          color="initials"
        >
          {order.customer.displayName.substring(0, 2).toUpperCase()}
        </Avatar>
        <div>
          <Text fw={500}>{order.customer.displayName}</Text>
          <Text size="xs" c="dimmed">
            {order.customer.email}
          </Text>
          <Text size="xs" c="dimmed">
            ID: {order.customer.id}
          </Text>
        </div>
      </Group>
    </Paper>
  );
};

export default CustomerInfoPartial;
