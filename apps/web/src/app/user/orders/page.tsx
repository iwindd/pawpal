"use client";
import FilterOrderStatusSelect from "@/components/Select/FilterOrderStatus";
import OrderStatusBadge from "@/components/ฺฺBadges/OrderStatus";
import { useGetOrderHistoryQuery } from "@/features/order/orderApi";
import { OrderStatus } from "@pawpal/shared";
import {
  Box,
  Card,
  Group,
  Loader,
  Pagination,
  Stack,
  Text,
  TextInput,
  Title,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

const LIMIT_ORDER = 5;

const OrderHistoryPage = () => {
  const __ = useTranslations("User.Orders");
  const format = useFormatter();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<OrderStatus | null>(null);

  const { data: orders, isLoading } = useGetOrderHistoryQuery({
    limit: LIMIT_ORDER,
    page: page,
    filter: filter || undefined,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!orders) {
    return null;
  }

  return (
    <Stack>
      <Box>
        <Title order={1} size="h2">
          {__("title")}
        </Title>
        <Text c="dimmed" size="sm">
          {__("subtitle")}
        </Text>
      </Box>

      <Group justify="space-between">
        <TextInput placeholder={__("search")} />
        <FilterOrderStatusSelect
          value={filter}
          onChange={(value) => setFilter(value as OrderStatus)}
        />
      </Group>

      {/* Desktop View */}
      <Stack gap="md">
        {orders.data.map((order) => (
          <Card key={order.id} shadow="sm" padding="md" radius="md">
            <Stack gap={0}>
              <Group justify="space-between" align="flex-start">
                <Group>
                  <Text fw={500} size="lg">
                    {order.cart
                      .map((item) => `${item.product.name} [${item.amount}]`)
                      .join(", ")}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {format.dateTime(new Date(order.createdAt), "dateTime")}
                  </Text>
                </Group>
                <OrderStatusBadge status={order.status} />
              </Group>

              <Group align="center">
                <Text fw={500} size="md" c="blue">
                  {format.number(order.total, {
                    style: "currency",
                    currency: "THB",
                  })}
                </Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Group justify="space-between">
        <Text c="dimmed">
          {__("page", {
            from: page * LIMIT_ORDER - LIMIT_ORDER + 1,
            to: Math.min(page * LIMIT_ORDER, orders.total),
            total: orders.total,
          })}
        </Text>
        <Pagination
          total={Math.ceil(orders.total / LIMIT_ORDER)}
          value={page}
          onChange={setPage}
        />
      </Group>
    </Stack>
  );
};

export default OrderHistoryPage;
