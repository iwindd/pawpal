import { HomeLayoutStatus } from "@pawpal/shared";
import { Badge } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface HomeLayoutStatusBadgeProps {
  status: HomeLayoutStatus;
}

const HomeLayoutStatusBadge = ({ status }: HomeLayoutStatusBadgeProps) => {
  const t = useTranslations("HomeLayout.status");
  const color =
    status === "PUBLISHED" ? "green" : status === "DRAFT" ? "blue" : "gray";

  return <Badge color={color}>{t(`label.${status}`)}</Badge>;
};

export default HomeLayoutStatusBadge;
