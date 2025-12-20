"use client";
import { ENUM_ORDER_STATUS } from "@pawpal/shared";
import { Select, SelectProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface FilterOrderStatusSelectProps extends Omit<SelectProps, "data"> {}

const ORDER_STATUS_FILTER = [
  ENUM_ORDER_STATUS.PENDING,
  ENUM_ORDER_STATUS.COMPLETED,
  ENUM_ORDER_STATUS.CANCELLED,
];

const FilterOrderStatusSelect = ({
  ...props
}: FilterOrderStatusSelectProps) => {
  const __ = useTranslations("Order");

  return (
    <Select
      placeholder={__("filter")}
      {...props}
      clearable={true}
      data={ORDER_STATUS_FILTER.map((status) => ({
        value: status,
        label: __(`status.${status.toLowerCase()}`),
      }))}
    />
  );
};

export default FilterOrderStatusSelect;
