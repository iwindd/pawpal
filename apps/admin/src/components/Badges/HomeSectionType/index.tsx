import { ENUM_HOME_SECTION_TYPE, HomeSectionType } from "@pawpal/shared";
import { Badge, DefaultMantineColor } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface HomeSectionTypeBadgeProps {
  type: HomeSectionType;
}

const colors: Record<HomeSectionType, DefaultMantineColor> = {
  [ENUM_HOME_SECTION_TYPE.ITEM_GROUP]: "blue",
  [ENUM_HOME_SECTION_TYPE.ITEM_SLIDER]: "grape",
};

const labels: Record<HomeSectionType, string> = {
  [ENUM_HOME_SECTION_TYPE.ITEM_GROUP]: "Item Group",
  [ENUM_HOME_SECTION_TYPE.ITEM_SLIDER]: "Item Slider",
};

const HomeSectionTypeBadge = ({ type }: HomeSectionTypeBadgeProps) => {
  const __ = useTranslations("Badge.HomeSectionType");
  return (
    <Badge color={colors[type]} variant="light">
      {__(`${type}`)}
    </Badge>
  );
};

export default HomeSectionTypeBadge;
