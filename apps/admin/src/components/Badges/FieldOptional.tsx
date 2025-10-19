"use client";
import { IconAsterisk } from "@pawpal/icons";
import { Badge, BadgeProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface FieldOptionalBadgeProps extends BadgeProps {
  optional: boolean;
  alpha?: number;
}

const FieldOptionalBadge = ({
  optional,
  ...props
}: FieldOptionalBadgeProps) => {
  const __ = useTranslations("Field.optional");

  const color = optional ? "green" : "yellow";
  const Icon = !optional && IconAsterisk;
  const status = optional ? "yes" : "no";

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

export default FieldOptionalBadge;
