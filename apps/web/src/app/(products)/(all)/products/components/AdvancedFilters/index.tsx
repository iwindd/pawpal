import { ProductFiltersResponse } from "@pawpal/shared";
import {
  Badge,
  Box,
  Card,
  MultiSelect,
  Select,
  Stack,
  Text,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface AdvancedFiltersProps {
  filtersData: ProductFiltersResponse | undefined;
  productType: string | null;
  platforms: string[];
  tags: string[];
  categories: string[];
  onProductTypeChange: (productType: string | null) => void;
  onPlatformsChange: (platforms: string[]) => void;
  onTagsChange: (tags: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
}

export default function AdvancedFilters({
  filtersData,
  productType,
  platforms,
  tags,
  categories,
  onProductTypeChange,
  onPlatformsChange,
  onTagsChange,
  onCategoriesChange,
}: AdvancedFiltersProps) {
  const __ = useTranslations("Products");

  const hasActiveFilters =
    productType ||
    platforms.length > 0 ||
    tags.length > 0 ||
    categories.length > 0;
  const activeFilterCount = [
    productType,
    platforms.length,
    tags.length,
    categories.length,
  ].filter(Boolean).length;

  return (
    <Card>
      <Card.Header
        title={__("advancedFilters")}
        action={
          hasActiveFilters && (
            <Badge size="sm" variant="light">
              {activeFilterCount}
            </Badge>
          )
        }
      />
      <Card.Content>
        <Stack gap="md">
          {/* Product Type Filter */}
          <Box>
            <Text size="sm" fw={500} mb="xs">
              {}
            </Text>
            <Select
              data={[
                { value: "", label: __("allTypes") },
                ...(filtersData?.types || []),
              ]}
              value={productType || ""}
              onChange={(value) => onProductTypeChange(value || null)}
              placeholder={__("selectProductType")}
              clearable
            />
          </Box>

          {/* Platforms Filter */}
          <Box>
            <Text size="sm" fw={500} mb="xs">
              {__("platforms")}
            </Text>
            <MultiSelect
              data={filtersData?.platforms || []}
              value={platforms}
              onChange={onPlatformsChange}
              placeholder={__("selectPlatforms")}
              clearable
              searchable
            />
          </Box>

          {/* Tags Filter */}
          <Box>
            <Text size="sm" fw={500} mb="xs">
              {__("tags")}
            </Text>
            <MultiSelect
              data={filtersData?.tags || []}
              value={tags}
              onChange={onTagsChange}
              placeholder={__("selectTags")}
              clearable
              searchable
            />
          </Box>

          {/* Categories Filter */}
          <Box>
            <Text size="sm" fw={500} mb="xs">
              {__("categories")}
            </Text>
            <MultiSelect
              data={filtersData?.categories || []}
              value={categories}
              onChange={onCategoriesChange}
              placeholder={__("selectCategories")}
              clearable
              searchable
            />
          </Box>
        </Stack>
      </Card.Content>
    </Card>
  );
}
