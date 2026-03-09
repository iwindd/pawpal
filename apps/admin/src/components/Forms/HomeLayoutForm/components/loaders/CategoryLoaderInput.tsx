"use client";
import CategoryCombobox from "@/components/Combobox/Category";
import { HomeLayoutInput } from "@pawpal/shared";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

interface CategoryLoaderInputProps {
  index: number;
  form: UseFormReturnType<HomeLayoutInput>;
}

export default function CategoryLoaderInput({
  index,
  form,
}: Readonly<CategoryLoaderInputProps>) {
  const t = useTranslations("HomeLayout.form");

  return (
    <CategoryCombobox
      inputProps={{
        withAsterisk: true,
        label: t("section-loader.category.label"),
        placeholder: t("section-loader.category.placeholder"),
      }}
      {...form.getInputProps(`sections.${index}.config.loader.name`)}
    />
  );
}
