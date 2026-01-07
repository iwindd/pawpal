"use client";
import { Colorization } from "@/libs/colorization";
import { TransactionStatus } from "@pawpal/shared";
import { Badge, BadgeProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface TopupStatusBadgeProps extends BadgeProps {
  status: TransactionStatus;
}

const TopupStatusBadge = ({ status, ...props }: TopupStatusBadgeProps) => {
  const __ = useTranslations("Transaction.status");
  const color = Colorization.transactionStatus(status);

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

export default TopupStatusBadge;
