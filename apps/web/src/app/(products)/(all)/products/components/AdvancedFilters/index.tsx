"use client";
import { ProductFiltersResponse } from "@pawpal/shared";
import { Badge, Card, Stack } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CollapsibleFilterSection from "./CollapsibleFilterSection";
import CollapsibleProductTypeFilter from "./CollapsibleProductTypeFilter";

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
  const [productTypeCollapsed, setProductTypeCollapsed] = useState(false);
  const [platformsCollapsed, setPlatformsCollapsed] = useState(true);
  const [tagsCollapsed, setTagsCollapsed] = useState(true);
  const [categoriesCollapsed, setCategoriesCollapsed] = useState(true);

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

  const handlePlatformChange = (value: string, checked: boolean) => {
    if (checked) {
      onPlatformsChange([...platforms, value]);
    } else {
      onPlatformsChange(platforms.filter((p) => p !== value));
    }
  };

  const handleTagChange = (value: string, checked: boolean) => {
    if (checked) {
      onTagsChange([...tags, value]);
    } else {
      onTagsChange(tags.filter((t) => t !== value));
    }
  };

  const handleCategoryChange = (value: string, checked: boolean) => {
    if (checked) {
      onCategoriesChange([...categories, value]);
    } else {
      onCategoriesChange(categories.filter((c) => c !== value));
    }
  };

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
        <Stack gap={"xs"}>
          {/* Product Type Filter */}
          <CollapsibleProductTypeFilter
            title={__("productType")}
            options={filtersData?.types || []}
            selectedValue={productType}
            onChange={onProductTypeChange}
            collapsed={productTypeCollapsed}
            onToggleCollapse={() =>
              setProductTypeCollapsed(!productTypeCollapsed)
            }
            showMoreText={__("showMore")}
            showLessText={__("showLess")}
          />

          {/* Platforms Filter */}
          <CollapsibleFilterSection
            title={__("platforms")}
            options={filtersData?.platforms || []}
            selectedValues={platforms}
            onChange={handlePlatformChange}
            collapsed={platformsCollapsed}
            onToggleCollapse={() => setPlatformsCollapsed(!platformsCollapsed)}
            showMoreText={__("showMore")}
            showLessText={__("showLess")}
          />

          {/* Tags Filter */}
          <CollapsibleFilterSection
            title={__("tags")}
            options={filtersData?.tags || []}
            selectedValues={tags}
            onChange={handleTagChange}
            collapsed={tagsCollapsed}
            onToggleCollapse={() => setTagsCollapsed(!tagsCollapsed)}
            showMoreText={__("showMore")}
            showLessText={__("showLess")}
          />

          {/* Categories Filter - Collapsible */}
          <CollapsibleFilterSection
            title={__("categories")}
            options={filtersData?.categories || []}
            selectedValues={categories}
            onChange={handleCategoryChange}
            collapsed={categoriesCollapsed}
            onToggleCollapse={() =>
              setCategoriesCollapsed(!categoriesCollapsed)
            }
            showMoreText={__("showMore")}
            showLessText={__("showLess")}
          />
        </Stack>
      </Card.Content>
    </Card>
  );
}
