"use client";
import useFormValidate from "@/hooks/useFormValidate";
import { UpdateProfileInput, updateProfileSchema } from "@pawpal/shared";
import { Button, Group, Stack, TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface UpdateProfileFormProps {
  initialValues: UpdateProfileInput;
  onSubmit: (values: UpdateProfileInput) => void;
  loading?: boolean;
}

export default function UpdateProfileForm({
  initialValues,
  onSubmit,
  loading,
}: Readonly<UpdateProfileFormProps>) {
  const __ = useTranslations("User.EditProfileModal");
  const form = useFormValidate<UpdateProfileInput>({
    schema: updateProfileSchema,
    initialValues,
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label={__("displayName")}
          placeholder={initialValues.displayName}
          key={form.key("displayName")}
          {...form.getInputProps("displayName")}
        />
        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {__("submit")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
