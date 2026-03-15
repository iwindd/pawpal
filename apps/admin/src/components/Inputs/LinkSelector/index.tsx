import {
  useGetCategoryQuery,
  useLazyGetCategoriesQuery,
} from "@/features/category/categoryApi";
import {
  useGetProductQuery,
  useLazyGetProductsQuery,
} from "@/features/productApi/productApi";
import {
  IconBox,
  IconCategory,
  IconExternalLink,
  IconLink,
} from "@pawpal/icons";
import {
  Box,
  Button,
  Input,
  Popover,
  ScrollArea,
  Skeleton,
  Text,
  TextInput,
  UnstyledButton,
} from "@pawpal/ui/core";
import { useDebouncedValue } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

interface LinkSelectorProps {
  value?: string;
  onChange?: (val: string) => void;
  disabledProduct?: boolean;
  disabledCategory?: boolean;
  disabledExternalLinks?: boolean;
  error?: string;
}

export default function LinkSelector({
  value,
  onChange,
  disabledProduct,
  disabledCategory,
  disabledExternalLinks,
  error,
}: Readonly<LinkSelectorProps>) {
  const t = useTranslations("LinkSelector");
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const [getProducts, { data: productsData, isFetching: fetchingProducts }] =
    useLazyGetProductsQuery();
  const [
    getCategories,
    { data: categoriesData, isFetching: fetchingCategories },
  ] = useLazyGetCategoriesQuery();

  useEffect(() => {
    if (opened) {
      if (!disabledProduct) {
        getProducts({ search: debouncedSearch, page: 1, limit: 5 });
      }
      if (!disabledCategory) {
        getCategories({ search: debouncedSearch, page: 1, limit: 5 });
      }
    }
  }, [debouncedSearch, opened, disabledProduct, disabledCategory]);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpened(false);
    setSearch("");
  };

  const isCustomLink = useMemo(() => {
    if (!debouncedSearch) return false;
    return (
      debouncedSearch.startsWith("http://") ||
      debouncedSearch.startsWith("https://") ||
      debouncedSearch.startsWith("/")
    );
  }, [debouncedSearch]);

  return (
    <>
      <Popover
        opened={opened}
        onChange={setOpened}
        width={300}
        position="bottom-start"
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <Button
            size="xs"
            variant="subtle"
            color="secondary"
            leftSection={<IconLink size={14} />}
            onClick={() => setOpened((o) => !o)}
          >
            {value ? <SelectedLabel value={value} /> : t("addLink")}
          </Button>
        </Popover.Target>
        <Popover.Dropdown p={0}>
          {value && (
            <Box
              p="sm"
              style={{
                backgroundColor: "var(--mantine-color-secondary-light)",
                color: "var(--mantine-color-secondary-light-color)",
                borderBottom: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconLink size={16} />
                <Text size="sm" fw={500} truncate>
                  {t("currentValue")}: <SelectedLabel value={value} />
                </Text>
              </div>
            </Box>
          )}
          <Box
            p="xs"
            style={{
              borderBottom: "1px solid var(--mantine-color-default-border)",
            }}
          >
            <TextInput
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              leftSection={<IconLink size={14} />}
            />
          </Box>
          <ScrollArea.Autosize mah={300}>
            {fetchingProducts || fetchingCategories ? (
              <Box p="sm">
                <Skeleton height={30} radius="sm" mb="xs" />
                <Skeleton height={30} radius="sm" mb="xs" />
                <Skeleton height={30} radius="sm" />
              </Box>
            ) : (
              <Box py="xs">
                {!disabledExternalLinks && isCustomLink && (
                  <RefItem
                    icon={<IconExternalLink size={16} />}
                    label={t("useCustomLink", { link: debouncedSearch })}
                    onClick={() => handleSelect(debouncedSearch)}
                  />
                )}

                {!disabledProduct && (productsData?.data.length ?? 0) > 0 && (
                  <>
                    <Text c="dimmed" size="xs" fw={500} px="sm" mt="xs" mb={4}>
                      {t("productSection")}
                    </Text>
                    {productsData?.data.map((p) => (
                      <RefItem
                        key={p.id}
                        icon={<IconBox size={16} />}
                        label={p.name}
                        onClick={() => handleSelect(`product:${p.id}`)}
                      />
                    ))}
                  </>
                )}

                {!disabledCategory &&
                  (categoriesData?.data.length ?? 0) > 0 && (
                    <>
                      <Text
                        c="dimmed"
                        size="xs"
                        fw={500}
                        px="sm"
                        mt="xs"
                        mb={4}
                      >
                        {t("categorySection")}
                      </Text>
                      {categoriesData?.data.map((c) => (
                        <RefItem
                          key={c.id}
                          icon={<IconCategory size={16} />}
                          label={c.name}
                          onClick={() => handleSelect(`category:${c.id}`)}
                        />
                      ))}
                    </>
                  )}

                {!isCustomLink &&
                  (productsData?.data.length ?? 0) === 0 &&
                  (categoriesData?.data.length ?? 0) === 0 && (
                    <Text c="dimmed" size="sm" ta="center" py="sm">
                      {t("notFound")}
                    </Text>
                  )}
              </Box>
            )}
          </ScrollArea.Autosize>
        </Popover.Dropdown>
      </Popover>
      {error && <Input.Error>{error}</Input.Error>}
    </>
  );
}

function RefItem({
  icon,
  label,
  onClick,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}>) {
  return (
    <UnstyledButton
      w="100%"
      px="sm"
      py={8}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
      className="hover-bg"
    >
      <Box c="dimmed" display="flex">
        {icon}
      </Box>
      <Text size="sm" truncate>
        {label}
      </Text>
    </UnstyledButton>
  );
}

function SelectedLabel({ value }: Readonly<{ value: string }>) {
  if (value.startsWith("product:")) {
    const id = value.split(":")[1];
    return <ProductLabel id={id} />;
  }
  if (value.startsWith("category:")) {
    const id = value.split(":")[1];
    return <CategoryLabel id={id} />;
  }
  return <span>{value}</span>;
}

function ProductLabel({ id }: Readonly<{ id?: string }>) {
  const { data } = useGetProductQuery(id || "", { skip: !id });
  const t = useTranslations("LinkSelector");

  return (
    <span>
      {t("productPrefix")} {data?.name || t("loading")}
    </span>
  );
}

function CategoryLabel({ id }: Readonly<{ id?: string }>) {
  const { data } = useGetCategoryQuery(id || "", { skip: !id });
  const t = useTranslations("LinkSelector");
  return (
    <span>
      {t("categoryPrefix")} {data?.name || t("loading")}
    </span>
  );
}
