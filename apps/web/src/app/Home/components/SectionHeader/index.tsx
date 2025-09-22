"use client";
import { getSectionIcon } from "@/utils/productUtils";
import { Button, Group, Text } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Countdown from "../Countdown";

interface SectionHeaderProps {
  title: string;
  slug: string;
  showMore?: boolean;
  onShowMore?: () => void;
  flashsaleEndTime?: string;
}

const SectionHeader = ({
  title,
  slug,
  showMore = false,
  onShowMore,
  flashsaleEndTime,
}: SectionHeaderProps) => {
  const __ = useTranslations("Home.ProductRow");

  return (
    <Group justify="space-between" align="center" mb="md">
      <Group gap="sm">
        <Text size="xl" fw={700}>
          {getSectionIcon(slug)} {title}
        </Text>
        {slug === "flashsale" && flashsaleEndTime && (
          <Countdown endTime={flashsaleEndTime} />
        )}
      </Group>
      {showMore && onShowMore && (
        <Button variant="transparent" size="xs" onClick={onShowMore}>
          {__("showMore")}
        </Button>
      )}
    </Group>
  );
};

export default SectionHeader;
