import { IconAll, IconGames, IconOther } from "@pawpal/icons";
import { Button, Group } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

export type CategoryKey = "all" | "games" | "other";

const CATEGORIES = [
  {
    key: "all",
    label: "filters.all",
    icon: IconAll,
  },
  {
    key: "games",
    label: "filters.games",
    icon: IconGames,
  },
  {
    key: "streaming",
    label: "filters.other",
    icon: IconOther,
  },
];

interface CategoriesProps {
  onFilter: (filter: CategoryKey) => void;
  value?: CategoryKey;
}

const Categories = ({ onFilter, value = "all" }: CategoriesProps) => {
  const __ = useTranslations("Products");
  if (!CATEGORIES.some((filter) => filter.key === value)) value = "all";

  return (
    <Group gap="xs">
      {Object.values(CATEGORIES).map((category) => (
        <Button
          key={category.key}
          component="button"
          leftSection={<category.icon size={12} />}
          variant={value === category.key ? "filled" : "outline"}
          size="xs"
          radius="xl"
          onClick={() => onFilter(category.key as CategoryKey)}
        >
          {__(category.label)}
        </Button>
      ))}
    </Group>
  );
};

export default Categories;
