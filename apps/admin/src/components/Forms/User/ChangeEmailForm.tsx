"use client";

import useFormValidate from "@/hooks/useFormValidate";
import { AdminResetEmailInput, adminResetEmailSchema } from "@pawpal/shared";
import { Button, Group, Stack, TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface ChangeEmailFormProps {
  initialValues: AdminResetEmailInput;
  onSubmit: (values: AdminResetEmailInput) => void;
  loading?: boolean;
}

export default function ChangeEmailForm({
  initialValues,
  onSubmit,
  loading,
}: Readonly<ChangeEmailFormProps>) {
  const __ = useTranslations("User.ChangeEmailModal");
  const form = useFormValidate<AdminResetEmailInput>({
    schema: adminResetEmailSchema,
    initialValues,
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label={__("email")}
          type="email"
          key={form.key("newEmail")}
          placeholder={initialValues.newEmail}
          {...form.getInputProps("newEmail")}
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
