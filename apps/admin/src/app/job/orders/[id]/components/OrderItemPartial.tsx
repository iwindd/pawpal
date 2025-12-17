"use client";
import { AdminOrderResponse } from "@pawpal/shared";
import { Badge, Group, Paper, Table, Text, Title } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const OrderItemPartial = (order: AdminOrderResponse) => {
  const __ = useTranslations("Order.view");
  const formatter = useFormatter();

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        {__("sections.items")}
      </Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{__("table.product")}</Table.Th>
            <Table.Th>{__("table.package")}</Table.Th>
            <Table.Th style={{ textAlign: "right" }}>
              {__("table.price")}
            </Table.Th>
            <Table.Th style={{ textAlign: "right" }}>
              {__("table.amount")}
            </Table.Th>
            <Table.Th style={{ textAlign: "right" }}>
              {__("table.total")}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {order.cart.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>
                <Group gap="xs">
                  <Text size="sm" fw={500}>
                    {item.product.name}
                  </Text>
                  <Badge variant="light" size="xs">
                    {item.category.name}
                  </Badge>
                </Group>
              </Table.Td>
              <Table.Td>{item.package.name}</Table.Td>
              <Table.Td style={{ textAlign: "right" }}>
                {formatter.number(item.price, "currency")}
              </Table.Td>
              <Table.Td style={{ textAlign: "right" }}>{item.amount}</Table.Td>
              <Table.Td style={{ textAlign: "right" }}>
                {formatter.number(item.price * item.amount, "currency")}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
};

export default OrderItemPartial;
