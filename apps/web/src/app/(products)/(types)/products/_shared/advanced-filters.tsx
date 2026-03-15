"use client";

import { ProductFiltersResponse } from "@pawpal/shared";
import { Stack } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CollapsibleFilterSection from "../../../(all)/products/components/AdvancedFilters/CollapsibleFilterSection";

interface VisibleFilterSections {
  categories?: boolean;
  platforms?: boolean;
  tags?: boolean;
}

interface TypeAdvancedFiltersProps {
  filtersData: ProductFiltersResponse | undefined;
  platforms: string[];
  tags: string[];
  categories: string[];
  onPlatformsChange: (platforms: string[]) => void;
  onTagsChange: (tags: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  visibleSections?: VisibleFilterSections;
}

export default function TypeAdvancedFilters({
  filtersData,
  platforms,
  tags,
  categories,
  onPlatformsChange,
  onTagsChange,
  onCategoriesChange,
  visibleSections,
}: TypeAdvancedFiltersProps) {
  const __ = useTranslations("Products");
  const [platformsCollapsed, setPlatformsCollapsed] = useState(true);
  const [tagsCollapsed, setTagsCollapsed] = useState(true);
  const [categoriesCollapsed, setCategoriesCollapsed] = useState(true);
  const {
    categories: showCategories = true,
    platforms: showPlatforms = true,
    tags: showTags = true,
  } = visibleSections ?? {};

  const handlePlatformChange = (value: string, checked: boolean) => {
    if (checked) {
      onPlatformsChange([...platforms, value]);
      return;
    }

    onPlatformsChange(platforms.filter((platform) => platform !== value));
  };

  const handleTagChange = (value: string, checked: boolean) => {
    if (checked) {
      onTagsChange([...tags, value]);
      return;
    }

    onTagsChange(tags.filter((tag) => tag !== value));
  };

  const handleCategoryChange = (value: string, checked: boolean) => {
    if (checked) {
      onCategoriesChange([...categories, value]);
      return;
    }

    onCategoriesChange(categories.filter((category) => category !== value));
  };

  return (
    <Stack gap={"xs"}>
      {showPlatforms && (
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
      )}

      {showTags && (
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
      )}

      {showCategories && (
        <CollapsibleFilterSection
          title={__("categories")}
          options={filtersData?.categories || []}
          selectedValues={categories}
          onChange={handleCategoryChange}
          collapsed={categoriesCollapsed}
          onToggleCollapse={() => setCategoriesCollapsed(!categoriesCollapsed)}
          showMoreText={__("showMore")}
          showLessText={__("showLess")}
        />
      )}
    </Stack>
  );
}
