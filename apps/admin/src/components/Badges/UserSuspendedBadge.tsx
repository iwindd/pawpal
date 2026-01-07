"use client";
import { Badge, BadgeProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface UserSuspendedBadgeProps extends BadgeProps {
  isSuspended: boolean;
}

const UserSuspendedBadge = ({
  isSuspended,
  ...props
}: UserSuspendedBadgeProps) => {
  const __ = useTranslations("UserStatus");

  return (
    <Badge color={isSuspended ? "red" : "green"} variant="light" {...props}>
      {isSuspended ? __("suspended") : __("active")}
    </Badge>
  );
};

export default UserSuspendedBadge;
