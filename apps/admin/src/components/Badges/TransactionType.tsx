"use client";
import { Colorization } from "@/libs/colorization";
import { TransactionType } from "@pawpal/shared";
import { Badge, BadgeProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface TransactionTypeBadgeProps extends BadgeProps {
  type: TransactionType;
}

const TransactionTypeBadge = ({
  type,
  ...props
}: TransactionTypeBadgeProps) => {
  const __ = useTranslations("Transaction.type");
  const color = Colorization.transactionType(type);

  return (
    <Badge
      size="md"
      color={color}
      variant="light"
      autoContrast={false}
      {...props}
    >
      {__(type.toLowerCase())}
    </Badge>
  );
};

export default TransactionTypeBadge;
