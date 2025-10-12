"use client";
import { CAROUSEL_STATUS, DEFAULT_CAROUSEL_STATUS } from "@/configs/carousel";
import { Select, SelectProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface SelectCarouselStatusProps extends Omit<SelectProps, "data"> {
  blacklist?: string[];
}

const SelectCarouselStatus = ({
  blacklist = [],
  ...props
}: SelectCarouselStatusProps) => {
  const __ = useTranslations("Carousel.status");

  const carouselStatusAvailable = CAROUSEL_STATUS.filter(
    (status) => !blacklist.includes(status.value)
  );

  return (
    <Select
      defaultValue={DEFAULT_CAROUSEL_STATUS}
      allowDeselect={false}
      {...props}
      data={carouselStatusAvailable.map((status) => ({
        value: status.value,
        label: __(status.label),
        icon: status.icon,
      }))}
    />
  );
};

export default SelectCarouselStatus;
