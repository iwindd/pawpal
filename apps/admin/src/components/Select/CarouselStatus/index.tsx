"use client";
import { CAROUSEL_STATUS, DEFAULT_CAROUSEL_STATUS } from "@/configs/carousel";
import { Select, SelectProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface SelectCarouselStatusProps extends Omit<SelectProps, "data"> {}

const SelectCarouselStatus = (props: SelectCarouselStatusProps) => {
  const __ = useTranslations("Carousel.status");

  return (
    <Select
      defaultValue={DEFAULT_CAROUSEL_STATUS}
      {...props}
      data={CAROUSEL_STATUS.map((status) => ({
        value: status.value,
        label: __(status.label),
        icon: status.icon,
      }))}
    />
  );
};

export default SelectCarouselStatus;
