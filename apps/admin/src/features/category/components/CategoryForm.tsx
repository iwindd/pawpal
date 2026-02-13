"use client";

import useFormValidate from "@/hooks/useFormValidate";
import {
  CategoryInput,
  categorySchema,
  CategoryUpdateInput,
  categoryUpdateSchema,
} from "@pawpal/shared";
import { Button, Group, Stack, TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface CategoryFormProps {
  initialValues?: CategoryUpdateInput;
  onSubmit: (values: CategoryInput | CategoryUpdateInput) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const CategoryForm = ({
  initialValues,
  onSubmit,
  isLoading,
  isEdit,
}: CategoryFormProps) => {
  const t = useTranslations("Category.form");

  const form = useFormValidate({
    schema: isEdit ? categoryUpdateSchema : categorySchema,
    initialValues: initialValues || {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.setValues(initialValues);
    }
  }, [initialValues]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label={t("name.label")}
          placeholder={t("name.placeholder")}
          withAsterisk
          {...form.getInputProps("name")}
        />
        <TextInput
          label={t("slug.label")}
          placeholder={t("slug.placeholder")}
          withAsterisk
          {...form.getInputProps("slug")}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={isLoading}>
            {t("save")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
