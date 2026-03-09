import { ENUM_HOME_LAYOUT_STATUS } from "@pawpal/shared";
import { Select, SelectProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface HomeLayoutStatusSelectProps extends Omit<
  SelectProps,
  "data" | "placeholder" | "label"
> {
  label?: string;
  placeholder?: string;
}

const HomeLayoutStatusSelect = ({
  label,
  placeholder,
  ...rest
}: HomeLayoutStatusSelectProps) => {
  const t = useTranslations("HomeLayout.status");

  const data = [
    { value: ENUM_HOME_LAYOUT_STATUS.DRAFT, label: t("label.DRAFT") },
    { value: ENUM_HOME_LAYOUT_STATUS.PUBLISHED, label: t("label.PUBLISHED") },
    { value: ENUM_HOME_LAYOUT_STATUS.ARCHIVED, label: t("label.ARCHIVED") },
  ];

  return (
    <Select
      data={data}
      label={label || t("input-label")}
      placeholder={placeholder || t("input-placeholder")}
      searchable
      {...rest}
    />
  );
};

export default HomeLayoutStatusSelect;
