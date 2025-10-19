import { ENUM_FIELD_TYPE } from "@pawpal/shared";
import { Select, SelectProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface FieldTypeSelectProps extends Omit<SelectProps, "data"> {}

const FieldTypeSelect = ({ ...props }: FieldTypeSelectProps) => {
  const __ = useTranslations("Field");

  return (
    <Select
      label={__("form.fields.type.label")}
      placeholder={__("form.fields.type.placeholder")}
      defaultValue={ENUM_FIELD_TYPE.TEXT}
      allowDeselect={false}
      {...props}
      data={[
        {
          value: ENUM_FIELD_TYPE.TEXT,
          label: __("types.text"),
        },
        {
          value: ENUM_FIELD_TYPE.SELECT,
          label: __("types.select"),
        },
        {
          value: ENUM_FIELD_TYPE.EMAIL,
          label: __("types.email"),
        },
        {
          value: ENUM_FIELD_TYPE.PASSWORD,
          label: __("types.password"),
        },
      ]}
    ></Select>
  );
};

export default FieldTypeSelect;
