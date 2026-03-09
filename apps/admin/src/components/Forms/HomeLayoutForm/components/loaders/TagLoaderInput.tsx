"use client";
import { HomeLayoutInput } from "@pawpal/shared";
import { TextInput } from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

interface TagLoaderInputProps {
  index: number;
  form: UseFormReturnType<HomeLayoutInput>;
}

export default function TagLoaderInput({
  index,
  form,
}: Readonly<TagLoaderInputProps>) {
  const t = useTranslations("HomeLayout.form");

  return (
    <TextInput
      withAsterisk
      label={t("section-loader.tag.label")}
      placeholder={t("section-loader.tag.placeholder")}
      {...form.getInputProps(`sections.${index}.config.loader.name`)}
    />
  );
}
