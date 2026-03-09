"use client";
import {
  ENUM_HOME_SECTION_SYSTEM_LOADER_NAME,
  HomeLayoutInput,
} from "@pawpal/shared";
import {
  Box,
  ComboboxLikeRenderOptionInput,
  Select,
  Text,
} from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

interface SystemLoaderInputProps {
  index: number;
  form: UseFormReturnType<HomeLayoutInput>;
}

export default function SystemLoaderInput({
  index,
  form,
}: Readonly<SystemLoaderInputProps>) {
  const t = useTranslations("HomeLayout.form");
  const tLoader = useTranslations("HomeLayout.loader");

  const systemLoaderNameData = [
    {
      value: ENUM_HOME_SECTION_SYSTEM_LOADER_NAME.popular,
      label: tLoader("system-name.popular"),
      description: tLoader("system-name.popular-description"),
    },
    {
      value: ENUM_HOME_SECTION_SYSTEM_LOADER_NAME.newest,
      label: tLoader("system-name.newest"),
      description: tLoader("system-name.newest-description"),
    },
    {
      value: ENUM_HOME_SECTION_SYSTEM_LOADER_NAME.latest,
      label: tLoader("system-name.latest"),
      description: tLoader("system-name.latest-description"),
    },
    {
      value: ENUM_HOME_SECTION_SYSTEM_LOADER_NAME.favorite,
      label: tLoader("system-name.favorite"),
      description: tLoader("system-name.favorite-description"),
    },
    {
      value: ENUM_HOME_SECTION_SYSTEM_LOADER_NAME.promotion,
      label: tLoader("system-name.promotion"),
      description: tLoader("system-name.promotion-description"),
    },
  ];

  return (
    <Select
      withAsterisk
      label={t("section-loader.system.label")}
      placeholder={t("section-loader.system.placeholder")}
      data={systemLoaderNameData}
      searchable
      {...form.getInputProps(`sections.${index}.config.loader.name`)}
      renderOption={({ option }: ComboboxLikeRenderOptionInput<any>) => (
        <Box>
          <Text size="sm">{option.label}</Text>
          <Text size="xs" c="dimmed">
            {option.description}
          </Text>
        </Box>
      )}
    />
  );
}
