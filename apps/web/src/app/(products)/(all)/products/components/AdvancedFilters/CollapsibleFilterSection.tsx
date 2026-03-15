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
import { useEffect, useState } from "react";

interface CollapsibleFilterSectionProps {
  title: string;
  options: ProductFilterOption[];
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  showMoreText: string;
  showLessText: string;
}

export default function CollapsibleFilterSection({
  title,
  options,
  selectedValues,
  onChange,
  collapsed,
  onToggleCollapse,
  showMoreText,
  showLessText,
}: CollapsibleFilterSectionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          <Text size="sm" c="primary">
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
          {options.map((option: ProductFilterOption) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={selectedValues.includes(option.value)}
              onChange={(event) =>
                onChange(option.value, event.currentTarget.checked)
              }
            />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}
