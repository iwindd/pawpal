"use client";
import { ENUM_TOPUP_STATUS } from "@pawpal/shared";
import { Select, SelectProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface FilterTopupStatus extends Omit<SelectProps, "data"> {}

const TOPUP_STATUS_FILTER = [
  ENUM_TOPUP_STATUS.PENDING,
  ENUM_TOPUP_STATUS.SUCCESS,
  ENUM_TOPUP_STATUS.FAILED,
];

const FilterTopupStatus = ({ ...props }: FilterTopupStatus) => {
  const __ = useTranslations("Topup");

  return (
    <Select
      placeholder={__("filter")}
      {...props}
      clearable={true}
      data={TOPUP_STATUS_FILTER.map((status) => ({
        value: status,
        label: __(`status.${status.toLowerCase()}`),
      }))}
    />
  );
};

export default FilterTopupStatus;
