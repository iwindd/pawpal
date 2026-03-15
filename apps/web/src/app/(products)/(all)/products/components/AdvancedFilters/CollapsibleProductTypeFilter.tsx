"use client";
import { IconChevronDown, IconChevronUp } from "@pawpal/icons";
import { ProductFilterOption } from "@pawpal/shared";
import {
  Box,
  Checkbox,
  Collapse,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface CollapsibleProductTypeFilterProps {
  title: string;
  options: ProductFilterOption[];
  selectedValue: string | null;
  onChange: (value: string | null) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  showMoreText: string;
  showLessText: string;
}

export default function CollapsibleProductTypeFilter({
  title,
  options,
  selectedValue,
  onChange,
  collapsed,
  onToggleCollapse,
  showMoreText,
  showLessText,
}: CollapsibleProductTypeFilterProps) {
  const __ = useTranslations("Products");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Map product type values to Thai labels using translations
  const getThaiLabel = (value: string): string => {
    switch (value) {
      case "GAME":
        return __("filters.games");
      case "CARD":
        return __("filters.cards");
      default:
        return value;
    }
  };

  // Transform options with Thai labels
  const transformedOptions = options.map((option) => ({
    ...option,
    label: getThaiLabel(option.value),
  }));

  return (
    <Box>
      <Group
        justify="space-between"
        style={{ cursor: "pointer" }}
        onClick={onToggleCollapse}
      >
        <Text size="sm" fw={500}>
          {title}
        </Text>
        <Tooltip
          label={collapsed ? showMoreText : showLessText}
          position="bottom"
          openDelay={500}
        >
          <Text
            size="sm"
            c="primary"
            style={{ cursor: "pointer" }}
            onClick={onToggleCollapse}
          >
            {isMounted &&
              (collapsed ? (
                <IconChevronDown size={14} />
              ) : (
                <IconChevronUp size={14} />
              ))}
          </Text>
        </Tooltip>
      </Group>
      <Collapse in={isMounted ? !collapsed : false}>
        <Stack gap="xs" mt="xs">
          {transformedOptions.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={selectedValue === option.value}
              onChange={(event) => {
                if (selectedValue === option.value) {
                  // If already selected, deselect it
                  onChange(null);
                } else {
                  // Select the new option
                  onChange(option.value);
                }
              }}
            />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}
