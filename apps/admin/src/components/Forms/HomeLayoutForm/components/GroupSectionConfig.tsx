"use client";
import { HomeLayoutInput } from "@pawpal/shared";
import { Box, Divider, Group, Stack, TextInput } from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

interface GroupSectionConfigProps {
  index: number;
  item: any;
  form: UseFormReturnType<HomeLayoutInput>;
}

export default function GroupSectionConfig({
  index,
  item,
  form,
}: GroupSectionConfigProps) {
  const t = useTranslations("HomeLayout.form");

  return (
    <Box mt="md">
      <Divider mb="sm" label={t("group-items")} />
      <Stack gap="sm">
        {item.config?.items?.map((sub: any, sIndex: number) => (
          <Group key={sub.id} align="flex-end" grow>
            <TextInput
              label={t("item-title")}
              withAsterisk
              {...form.getInputProps(
                `sections.${index}.config.items.${sIndex}.title`,
              )}
            />
            <TextInput
              label={t("item-subtitle")}
              withAsterisk
              {...form.getInputProps(
                `sections.${index}.config.items.${sIndex}.subtitle`,
              )}
            />
            <TextInput
              label={t("item-image")}
              withAsterisk
              {...form.getInputProps(
                `sections.${index}.config.items.${sIndex}.image`,
              )}
            />
            <TextInput
              label={t("item-link")}
              withAsterisk
              {...form.getInputProps(
                `sections.${index}.config.items.${sIndex}.href`,
              )}
            />
          </Group>
        ))}
      </Stack>
    </Box>
  );
}
