"use client";
import { CAROUSEL_STATUS } from "@/configs/carousel";
import { CarouselStatus } from "@pawpal/shared";
import { Badge, BadgeProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface CarouselStatusBadgeProps extends BadgeProps {
  status: CarouselStatus;
  alpha?: number;
}

const getStatusIcon = (
  status: CarouselStatus
): React.ComponentType<any> | undefined => {
  return CAROUSEL_STATUS.find((s) => s.value === status)?.icon;
};

const CarouselStatusBadge = ({
  status,
  ...props
}: CarouselStatusBadgeProps) => {
  const __ = useTranslations("Carousel.status");

  const color = {
    PUBLISHED: "green",
    DRAFT: "yellow",
    ARCHIVED: "blue",
  }[status];
  const Icon = getStatusIcon(status);

  return (
    <Badge
      size="xl"
      color={color}
      rightSection={Icon && <Icon size={15} />}
      variant="light"
      autoContrast={false}
      {...props}
    >
      {__(status.toLowerCase())}
    </Badge>
  );
};

export default CarouselStatusBadge;
