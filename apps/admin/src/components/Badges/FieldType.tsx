"use client";
import { FieldType } from "@pawpal/shared";
import { Badge, BadgeProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface FieldTypeBadgeProps extends BadgeProps {
  type: FieldType;
  alpha?: number;
}

const FieldTypeBadge = ({ type, ...props }: FieldTypeBadgeProps) => {
  const __ = useTranslations("Field.types");

  return (
    <Badge
      size="xl"
      color={"gray"}
      variant="light"
      autoContrast={false}
      {...props}
    >
      {__(type.toLowerCase())}
    </Badge>
  );
};

export default FieldTypeBadge;
