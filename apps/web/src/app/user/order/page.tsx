"use client";
import { Badge, Box, Card, Group, Stack, Text, Title } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const OrderPage = () => {
  const __ = useTranslations("User.Orders");
  const format = useFormatter();

  // Mock order data
  const orders = [
    {
      id: "ORD-001",
      date: new Date("2024-01-15"),
      items: "Premium Dog Food (2x), Cat Litter (1x)",
      status: "delivered",
      total: 1250,
    },
    {
      id: "ORD-002",
      date: new Date("2024-01-10"),
      items: "Dog Toy Set, Cat Scratching Post",
      status: "shipped",
      total: 890,
    },
    {
      id: "ORD-003",
      date: new Date("2024-01-05"),
      items: "Pet Grooming Kit, Fish Food",
      status: "processing",
      total: 450,
    },
    {
      id: "ORD-004",
      date: new Date("2023-12-28"),
      items: "Bird Cage, Hamster Wheel",
      status: "delivered",
      total: 2100,
    },
    {
      id: "ORD-005",
      date: new Date("2023-12-20"),
      items: "Dog Leash, Cat Carrier",
      status: "cancelled",
      total: 320,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "green";
      case "shipped":
        return "blue";
      case "processing":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return __("status.delivered");
      case "shipped":
        return __("status.shipped");
      case "processing":
        return __("status.processing");
      case "cancelled":
        return __("status.cancelled");
      default:
        return status;
    }
  };

  return (
    <Stack gap="xl">
      <Box>
        <Title order={1} size="h2">
          {__("title")}
        </Title>
        <Text c="dimmed" size="sm">
          {__("subtitle")}
        </Text>
      </Box>

      {/* Desktop View */}
      <Stack gap="md">
        {orders.map((order) => (
          <Card key={order.id} shadow="sm" padding="md" radius="md">
            <Stack gap={0}>
              <Group justify="space-between" align="flex-start">
                <Group>
                  <Text fw={500} size="lg">
                    {order.id}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {format.dateTime(order.date, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </Group>
                <Badge
                  color={getStatusColor(order.status)}
                  variant="light"
                  size="sm"
                >
                  {getStatusText(order.status)}
                </Badge>
              </Group>

              <Group align="center">
                <Text fw={500} size="md" c="blue">
                  {format.number(order.total, {
                    style: "currency",
                    currency: "THB",
                  })}
                </Text>
                <Text size="sm" lineClamp={2}>
                  {order.items}
                </Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

export default OrderPage;
