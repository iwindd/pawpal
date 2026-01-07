"use client";
import useFormValidate from "@/hooks/useFormValidate";
import {
  AdminResetPasswordInput,
  adminResetPasswordSchema,
} from "@pawpal/shared";
import { Button, Group, PasswordInput, Stack } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface ChangePasswordFormProps {
  onSubmit: (values: AdminResetPasswordInput) => void;
  loading?: boolean;
}

export default function ChangePasswordForm({
  onSubmit,
  loading,
}: Readonly<ChangePasswordFormProps>) {
  const __ = useTranslations("User.ChangePasswordModal");
  const form = useFormValidate<AdminResetPasswordInput>({
    schema: adminResetPasswordSchema,
    initialValues: {
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <PasswordInput
          label={__("password.label")}
          placeholder={__("password.placeholder")}
          key={form.key("newPassword")}
          {...form.getInputProps("newPassword")}
        />
        <PasswordInput
          label={__("confirmPassword.label")}
          placeholder={__("confirmPassword.placeholder")}
          key={form.key("newPasswordConfirmation")}
          {...form.getInputProps("newPasswordConfirmation")}
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
