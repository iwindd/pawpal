"use client";
import { Colorization } from "@/libs/colorization";
import { OrderStatus } from "@pawpal/shared";
import { Badge, BadgeProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface OrderStatusBadgeProps extends BadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge = ({ status, ...props }: OrderStatusBadgeProps) => {
  const __ = useTranslations("Order.status");
  const color = Colorization.orderStatus(status);

  return (
    <Badge
      size="xl"
      color={color}
      variant="light"
      autoContrast={false}
      {...props}
    >
      {__(status.toLowerCase())}
    </Badge>
  );
};

export default OrderStatusBadge;
