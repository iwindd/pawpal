"use client";
import OrderStatusBadge from "@/components/Badges/OrderStatus";
import {
  useCancelTopupOrderMutation,
  useConfirmTopupOrderMutation,
} from "@/features/order/orderApi";
import { AdminOrderResponse, ENUM_ORDER_STATUS } from "@pawpal/shared";
import { backdrop } from "@pawpal/ui/backdrop";
import {
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";
import { useConfirmation } from "@pawpal/ui/provider";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import CustomerInfoPartial from "./components/CustomerInfoPartial";
import OrderFieldPartial from "./components/OrderFieldPartial";
import OrderItemPartial from "./components/OrderItemPartial";
import SummaryPartial from "./components/SummaryPartial";
import TransactionHistoryPartial from "./components/TransactionHistoryPartial";

interface OrderViewProps {
  order: AdminOrderResponse;
}

const OrderView = ({ order }: OrderViewProps) => {
  const router = useRouter();
  const __ = useTranslations("Order.view");
  const formatter = useFormatter();
  const { confirmation } = useConfirmation();
  const [confirmTopupOrder] = useConfirmTopupOrderMutation();
  const [cancelTopupOrder] = useCancelTopupOrderMutation();

  const onConfirmTopupOrder = confirmation(
    async () => {
      backdrop.show(__("backdrop.completing"));
      const response = await confirmTopupOrder(order.id);
      backdrop.hide();
      router.refresh();

      if (response.error) {
        return Notifications.show({
          color: "red",
          title: __("notify.error.title"),
          message: __("notify.error.message"),
        });
      }

      Notifications.show({
        color: "green",
        title: __("notify.success.title"),
        message: __("notify.success.message"),
      });
    },
    {
      title: __("confirmation.complete.title"),
      message: __("confirmation.complete.message"),
    }
  );

  const onCancelTopupOrder = confirmation(
    async () => {
      backdrop.show(__("backdrop.canceling"));
      const response = await cancelTopupOrder(order.id);
      backdrop.hide();

      if (response.error) {
        router.refresh();
        return Notifications.show({
          color: "red",
          title: __("notify.error.title"),
          message: __("notify.error.message"),
        });
      }

      Notifications.show({
        color: "green",
        title: __("notify.success.title"),
        message: __("notify.success.message"),
      });
    },
    {
      title: __("confirmation.cancel.title"),
      message: __("confirmation.cancel.message"),
    }
  );

  return (
    <Stack>
      {/* Header */}
      <Paper p="md" withBorder>
        <Group justify="space-between">
          <Group>
            <Title order={3}>{__("title", { id: order.id })}</Title>
            <OrderStatusBadge status={order.status} size="lg" />
          </Group>
          <Group justify="end" mt="xs">
            <Text c="dimmed" size="sm">
              {formatter.dateTime(new Date(order.createdAt), "dateTime")}
            </Text>
          </Group>
        </Group>
      </Paper>

      <Grid>
        {/* Main Content - Left */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack>
            <OrderItemPartial {...order} />
            <TransactionHistoryPartial {...order} />
          </Stack>
        </Grid.Col>

        {/* Sidebar - Right */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            <CustomerInfoPartial {...order} />
            <OrderFieldPartial {...order} />
            <SummaryPartial {...order} />
          </Stack>
        </Grid.Col>
      </Grid>

      {/* FOOTER */}
      {order.status === ENUM_ORDER_STATUS.PENDING && (
        <Paper p="md" withBorder>
          <Group justify="flex-end">
            <Group>
              <Button color="red" variant="light" onClick={onCancelTopupOrder}>
                {__("actions.cancel")}
              </Button>
              <Button color="green" onClick={onConfirmTopupOrder}>
                {__("actions.confirm")}
              </Button>
            </Group>
          </Group>
        </Paper>
      )}
    </Stack>
  );
};

export default OrderView;
