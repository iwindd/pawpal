"use client";
import { Colorization } from "@/utils/colorization";
import { TopupStatus } from "@pawpal/shared";
import { Badge, BadgeProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface TopupStatusBadgeProps extends BadgeProps {
  status: TopupStatus;
}

const TopupStatusBadge = ({ status, ...props }: TopupStatusBadgeProps) => {
  const __ = useTranslations("Topup.status");
  const color = Colorization.topupStatus(status);

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
