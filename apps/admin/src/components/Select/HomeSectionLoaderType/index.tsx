import { ENUM_HOME_SECTION_LOADER_TYPE } from "@pawpal/shared";
import { Select, SelectProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface HomeSectionLoaderTypeSelectProps extends Omit<
  SelectProps,
  "data" | "placeholder" | "label"
> {
  label?: string;
  placeholder?: string;
}

const HomeSectionLoaderTypeSelect = ({
  label,
  placeholder,
  ...rest
}: HomeSectionLoaderTypeSelectProps) => {
  const t = useTranslations("HomeLayout.loader");

  const data = [
    { value: ENUM_HOME_SECTION_LOADER_TYPE.system, label: t("label.system") },
    { value: ENUM_HOME_SECTION_LOADER_TYPE.tag, label: t("label.tag") },
    {
      value: ENUM_HOME_SECTION_LOADER_TYPE.category,
      label: t("label.category"),
    },
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

export default HomeSectionLoaderTypeSelect;
